import argparse
import collections
import hashlib
import json
import os
from pathlib import Path
import re
import sys


def identifier(value):
  if isinstance(value, str) and value:
    return value
  return None


def issue(issues, line, reason):
  entry = {"line": line, "reason": reason}
  if entry not in issues:
    issues.append(entry)


def origin(message):
  return {key: message[key] for key in ("line", "offset", "bytes", "timestamp", "ordinal", "kind", "subtype", "turn", "record_id", "id",
                                       "call_id", "role", "phase", "name", "item_type", "item_id") if key in message}


def read_content(content, line, gaps):
  parts = []
  if isinstance(content, str):
    content = [{"type": "text", "text": content}]
  if not isinstance(content, list) or not content:
    issue(gaps, line, "missing_or_invalid_message_content")
    return parts
  image_path = None
  for part in content:
    if not isinstance(part, dict):
      issue(gaps, line, "invalid_message_content_part")
      continue
    kind = part.get("type")
    if kind in ("text", "Text", "input_text", "output_text"):
      value = part.get("text")
      if not isinstance(value, str):
        issue(gaps, line, "invalid_message_text")
        continue
      wrapper = re.fullmatch(r'<image(?:\s+name=.*?)?\s+path="([^"]+)">', value)
      if wrapper:
        if image_path:
          issue(gaps, line, "unclosed_image_wrapper")
        image_path = wrapper.group(1)
      elif value == "</image>" and parts and parts[-1]["type"] == "image":
        pass
      else:
        parts.append({"type": "text", "text": value})
        if part.get("text_elements"):
          issue(gaps, line, "unrecognized_text_elements")
    elif kind in ("input_image", "local_image"):
      marker = {"type": "image"}
      if kind == "local_image":
        reference = part.get("path")
      else:
        reference = part.get("image_url")
      if not isinstance(reference, str) or not reference:
        issue(gaps, line, "missing_or_invalid_image_reference")
      elif reference.startswith("data:"):
        marker["inline_data_omitted"] = True
        marker["sha256"] = hashlib.sha256(reference.encode("utf-8")).hexdigest()
      else:
        marker["reference"] = reference
      if image_path:
        marker["reference"] = image_path
        image_path = None
      parts.append(marker)
    else:
      # Preserve a marker, never an unknown attachment's body or inline data.
      marker = {"type": "unrecognized_content", "source_type": identifier(kind)}
      for key in ("path", "url", "file_id", "filename"):
        value = part.get(key)
        if isinstance(value, str) and not value.startswith("data:"):
          marker[key] = value
      parts.append(marker)
      issue(gaps, line, "unrecognized_message_content_type")
  if image_path:
    issue(gaps, line, "unclosed_image_wrapper")
  return parts


def message_text(message):
  return "\n".join(part["text"] for part in message["content"] if part["type"] == "text")


def content_key(message):
  attachments = []
  for part in message["content"]:
    if part["type"] == "text":
      continue
    if part["type"] == "image" and part.get("reference"):
      attachments.append(("image", part["reference"].replace("\\", "/")))
    else:
      attachments.append(json.dumps(part, sort_keys=True, ensure_ascii=False))
  return message_text(message), tuple(attachments)


def structured_object(value, line, gaps, reason):
  if isinstance(value, str):
    try:
      value = json.loads(value)
    except (ValueError, RecursionError):
      issue(gaps, line, reason)
      return None
  if not isinstance(value, dict):
    issue(gaps, line, reason)
    return None
  return value


def questions_from(value, line, gaps):
  data = structured_object(value, line, gaps, "invalid_clarification_arguments")
  if data is None:
    return []
  questions = data.get("questions")
  if not isinstance(questions, list) or not questions:
    issue(gaps, line, "missing_or_invalid_clarification_questions")
    return []
  result = []
  for question in questions:
    if not isinstance(question, dict):
      issue(gaps, line, "invalid_clarification_question")
      continue
    selected = {key: question[key] for key in ("id", "header", "title", "question") if isinstance(question.get(key), str)}
    if any(key in question and not isinstance(question[key], str) for key in ("id", "header", "title", "question")):
      issue(gaps, line, "invalid_clarification_question_field")
    if question.get("options") is not None:
      selected["options"] = []
      if not isinstance(question["options"], list):
        issue(gaps, line, "invalid_clarification_options")
      else:
        for option in question["options"]:
          if isinstance(option, str):
            selected["options"].append(option)
          elif isinstance(option, dict) and isinstance(option.get("label"), str):
            selected["options"].append({key: option[key] for key in ("label", "description") if isinstance(option.get(key), str)})
            if set(option) - {"label", "description"} or ("description" in option and not isinstance(option["description"], str)):
              issue(gaps, line, "unrecognized_clarification_option_fields")
          else:
            issue(gaps, line, "invalid_clarification_option")
    if not isinstance(question.get("question", question.get("title")), str):
      issue(gaps, line, "missing_clarification_question_text")
    if set(question) - {"id", "header", "title", "question", "options"}:
      issue(gaps, line, "unrecognized_clarification_question_fields")
    result.append(selected)
  if set(data) - {"questions"}:
    issue(gaps, line, "unrecognized_clarification_argument_fields")
  return result


def classify_message(message, gaps):
  text = message_text(message)
  message["category"] = "conversation"
  if message["role"] != "user":
    return
  if text.startswith('<codex_internal_context source="goal">'):
    message["category"] = "automatic_goal_context"
  elif text.startswith("<codex_internal_context"):
    message["category"] = "injected_context"
  elif text.startswith("<recommended_plugins>") or text.startswith("<environment_context>"):
    message["category"] = "injected_environment"
  elif text.startswith("# AGENTS.md instructions"):
    message["category"] = "historical_instructions"
  elif text.startswith("<send_user_message_question_reply>"):
    message["category"] = "clarification_answer"
    match = re.fullmatch(r"<send_user_message_question_reply>\s*(.*?)\s*</send_user_message_question_reply>", text, re.DOTALL)
    try:
      answers = json.loads(match.group(1)) if match else None
    except (ValueError, RecursionError):
      answers = None
    if not isinstance(answers, list) or not answers:
      issue(gaps, message["line"], "invalid_structured_clarification_answer")
      return
    message["answers"] = []
    for answer in answers:
      if not isinstance(answer, dict):
        issue(gaps, message["line"], "invalid_structured_clarification_answer")
        continue
      selected = {key: answer[key] for key in ("questionItemId", "question", "answer") if isinstance(answer.get(key), str)}
      try:
        relationship = json.loads(answer.get("questionItemId", ""))
      except (TypeError, ValueError, RecursionError):
        relationship = None
      if (isinstance(relationship, list) and len(relationship) == 3 and
          relationship[0] in ("request_user_input", "request_user_input_async") and identifier(relationship[1]) and
          isinstance(relationship[2], int) and not isinstance(relationship[2], bool) and relationship[2] >= 0):
        selected.update(tool_name=relationship[0], call_id=relationship[1], question_index=relationship[2])
      else:
        issue(gaps, message["line"], "invalid_clarification_answer_relationship")
      if not isinstance(answer.get("question"), str) or not isinstance(answer.get("answer"), str):
        issue(gaps, message["line"], "missing_or_invalid_clarification_answer_text")
      if set(answer) - {"questionItemId", "question", "answer"}:
        issue(gaps, message["line"], "unrecognized_clarification_answer_fields")
      message["answers"].append(selected)


def combine_copies(messages, questions, warnings):
  calls = collections.defaultdict(list)
  for question in questions:
    if question.get("call_id"):
      calls[question["call_id"]].append(question)
  retained = []
  for message in messages:
    candidates = calls.get(message.get("id"), [])
    if message["kind"] == "event_msg" and message["role"] == "assistant" and len(candidates) == 1:
      question = candidates[0]
      if message.get("questions") == question["questions"] and question["questions"]:
        question["copies"].append({"reason": "rendered_question_copy", **origin(message)})
        continue
      issue(warnings, message["line"], "call_id_matches_question_but_content_is_not_proven")
    retained.append(message)

  by_identity = collections.defaultdict(list)
  by_content = collections.defaultdict(list)
  for position, message in enumerate(retained):
    if message.get("id"):
      by_identity[(message["role"], message["id"])].append(position)
    by_content[(message["role"], content_key(message))].append(position)

  candidates = {}
  for position, message in enumerate(retained):
    if message.get("partial"):
      candidates[position] = []
      continue
    matches = []
    if message.get("id"):
      matches = by_identity[(message["role"], message["id"])]
    if any(retained[other]["kind"] != message["kind"] and content_key(retained[other]) != content_key(message) for other in matches):
      issue(warnings, message["line"], "same_id_with_incompatible_content_retained")
    matches = [other for other in matches if other != position and not retained[other].get("partial") and
               retained[other]["kind"] != message["kind"] and
               content_key(retained[other]) == content_key(message) and
               (not message["turn"] or not retained[other]["turn"] or message["turn"] == retained[other]["turn"])]
    if not matches and message["turn"]:
      matches = [other for other in by_content[(message["role"], content_key(message))] if other != position and
                 not retained[other].get("partial") and
                 retained[other]["kind"] != message["kind"] and retained[other]["turn"] == message["turn"]]
    candidates[position] = matches

  removed = set()
  for position, message in enumerate(retained):
    if position in removed:
      continue
    matches = candidates[position]
    if len(matches) == 1 and candidates[matches[0]] == [position]:
      other = matches[0]
      if other in removed:
        continue
      same_id = message.get("id") and message["id"] == retained[other].get("id")
      if not same_id and abs(message["line"] - retained[other]["line"]) != 1:
        issue(warnings, message["line"], "nonadjacent_message_candidates_retained")
        continue
      if message["kind"] == "response_item":
        canonical, copy = message, retained[other]
        removed.add(other)
      else:
        canonical, copy = retained[other], message
        removed.add(position)
      reason = "same_id_copy"
      if not canonical.get("id") or canonical["id"] != copy.get("id"):
        reason = "local_turn_content_copy"
      canonical["copies"].append({"reason": reason, **origin(copy)})
    elif matches:
      issue(warnings, message["line"], "ambiguous_message_copies_retained")
    elif any(retained[other]["kind"] != message["kind"] for other in by_content[(message["role"], content_key(message))]):
      issue(warnings, message["line"], "matching_text_without_proven_identity_retained")
  return [message for position, message in enumerate(retained) if position not in removed], calls


def extract(source_path, output_path):
  gaps, warnings = [], []
  messages, questions, results = [], [], []
  unlinked_outputs = []
  counts = collections.Counter()
  dispositions = collections.Counter()
  known_calls = set()
  digest = hashlib.sha256()
  current_turn = None
  previous_ordinal = None
  consumed = 0
  line_number = 0
  excluded_records = {"session_meta", "world_state", "turn_context", "token_usage_record", "inter_agent_communication_metadata", "compacted"}
  excluded_events = {"task_started", "task_complete", "token_count", "thread_settings_applied", "thread_goal_updated"}
  excluded_items = {"CommandExecution", "Reasoning", "SubAgentActivity", "FileChange", "ContextCompaction", "McpToolCall",
                    "CollabAgentToolCall", "Extension", "ImageView"}

  with source_path.open("rb") as source:
    initial = os.fstat(source.fileno())
    output_path.mkdir(parents=True, exist_ok=False)
    with (output_path / "index.jsonl").open("x", encoding="utf-8", newline="\n") as index:
      while consumed < initial.st_size:
        raw = source.readline(initial.st_size - consumed)
        if not raw:
          break
        line_number += 1
        gaps_before_record = len(gaps)
        entry = {"line": line_number, "offset": consumed, "bytes": len(raw)}
        consumed += len(raw)
        digest.update(raw)
        try:
          record = json.loads(raw)
        except (ValueError, UnicodeError, RecursionError):
          record = None
          issue(gaps, line_number, "malformed_json_record")
        if not isinstance(record, dict):
          if len(gaps) == gaps_before_record:
            issue(gaps, line_number, "invalid_record_object")
          entry["disposition"] = "coverage_gap"
          dispositions[entry["disposition"]] += 1
          index.write(json.dumps(entry, ensure_ascii=False) + "\n")
          continue
        payload = record.get("payload")
        if not isinstance(payload, dict):
          issue(gaps, line_number, "missing_or_invalid_payload")
          payload = {}
        metadata = payload.get("internal_chat_message_metadata_passthrough", {})
        if not isinstance(metadata, dict):
          issue(gaps, line_number, "invalid_message_metadata")
          metadata = {}
        kind = record.get("type")
        subtype = payload.get("type")
        if not isinstance(kind, str) or (subtype is not None and not isinstance(subtype, str)):
          issue(gaps, line_number, "invalid_record_type")
          kind, subtype = None, None
        if kind == "event_msg" and subtype == "task_started":
          current_turn = identifier(payload.get("turn_id"))
        turn = identifier(metadata.get("turn_id")) or identifier(payload.get("turn_id")) or current_turn
        item = payload
        if kind == "event_msg" and subtype == "item_completed":
          item = payload.get("item")
          if not isinstance(item, dict):
            issue(gaps, line_number, "missing_or_invalid_completed_item")
            item = {}
        ordinal = record.get("ordinal")
        if ordinal is not None and (not isinstance(ordinal, int) or isinstance(ordinal, bool)):
          issue(gaps, line_number, "invalid_record_ordinal")
          ordinal = None
        entry.update(timestamp=identifier(record.get("timestamp")), ordinal=ordinal, kind=kind, subtype=subtype, turn=turn,
                     record_id=identifier(record.get("id")), id=identifier(payload.get("id")), call_id=identifier(payload.get("call_id")),
                     role=identifier(payload.get("role")), phase=identifier(item.get("phase")), name=identifier(payload.get("name")))
        if item is not payload:
          entry.update(item_type=identifier(item.get("type")), item_id=identifier(item.get("id")))
        ordinal = entry["ordinal"]
        if isinstance(ordinal, int):
          if previous_ordinal is not None and ordinal <= previous_ordinal:
            issue(warnings, line_number, "nonincreasing_ordinal_physical_order_preserved")
          previous_ordinal = ordinal
        counts[(kind, subtype)] += 1
        disposition = "excluded_metadata"
        message_role = None
        if kind == "response_item" and subtype == "message":
          if payload.get("role") in ("user", "assistant"):
            message_role = payload["role"]
          elif payload.get("role") not in ("system", "developer"):
            issue(gaps, line_number, "unrecognized_message_role")
        elif kind == "event_msg" and subtype == "item_completed":
          if item.get("type") == "UserMessage":
            message_role = "user"
          elif item.get("type") == "AgentMessage":
            message_role = "assistant"
          elif identifier(item.get("type")) not in excluded_items:
            issue(gaps, line_number, "unrecognized_completed_item_type")

        if message_role and item.get("channel") not in ("analysis", "summary"):
          message = {**entry, "id": identifier(item.get("id")), "role": message_role,
                     "content": read_content(item.get("content"), line_number, gaps), "copies": []}
          if "questions" in item:
            message["questions"] = questions_from({"questions": item["questions"]}, line_number, gaps)
          classify_message(message, gaps)
          if len(gaps) > gaps_before_record:
            message["partial"] = True
          message["historical_data_only"] = True
          messages.append(message)
          disposition = message["category"]
        elif kind == "response_item" and subtype in ("function_call", "custom_tool_call"):
          name = payload.get("name")
          if name in ("request_user_input", "request_user_input_async"):
            question = {**entry, "category": "clarification_question", "historical_data_only": True,
                        "questions": questions_from(payload.get("arguments", payload.get("input")), line_number, gaps),
                        "copies": []}
            questions.append(question)
            if entry["call_id"]:
              if entry["call_id"] in known_calls:
                issue(gaps, line_number, "duplicate_clarification_call_id")
              known_calls.add(entry["call_id"])
            else:
              issue(gaps, line_number, "missing_clarification_call_id")
            disposition = "clarification_question"
          elif not isinstance(name, str):
            issue(gaps, line_number, "missing_tool_call_name")
          elif "request_user_input" in name:
            issue(gaps, line_number, "unrecognized_clarification_tool_name")
        elif kind == "response_item" and subtype in ("function_call_output", "custom_tool_call_output"):
          if entry["call_id"] in known_calls:
            result = structured_object(payload.get("output"), line_number, gaps, "invalid_clarification_result")
            if result is not None:
              if set(result) - {"accepted", "answers"} or not result:
                issue(gaps, line_number, "unrecognized_clarification_result_fields")
              result = {key: result[key] for key in ("accepted", "answers") if key in result}
              if "accepted" in result and not isinstance(result["accepted"], bool):
                issue(gaps, line_number, "invalid_clarification_acceptance")
                del result["accepted"]
              if "answers" in result and not isinstance(result["answers"], dict):
                issue(gaps, line_number, "invalid_clarification_result_answers")
                del result["answers"]
              if "answers" in result:
                answers = {}
                for question_id, answer in result["answers"].items():
                  if (isinstance(answer, dict) and isinstance(answer.get("answers"), list) and
                      all(isinstance(text, str) for text in answer["answers"])):
                    answers[question_id] = {"answers": answer["answers"]}
                    if set(answer) - {"answers"}:
                      issue(gaps, line_number, "unrecognized_clarification_result_answer_fields")
                  else:
                    issue(gaps, line_number, "invalid_clarification_result_answer")
                result["answers"] = answers
              results.append({**entry, "category": "clarification_tool_result", "historical_data_only": True,
                              "result": result})
            disposition = "clarification_tool_result"
          elif entry["call_id"]:
            unlinked_outputs.append({"line": line_number, "call_id": entry["call_id"]})
          else:
            issue(gaps, line_number, "missing_tool_result_call_id")
        elif kind == "response_item" and subtype in ("message", "reasoning", "agent_message"):
          pass
        elif kind == "event_msg" and (subtype in excluded_events or subtype == "item_completed"):
          pass
        elif kind not in excluded_records:
          if (kind in ("response_item", "event_msg") or "message" in (kind or "").lower() or
              any(key in payload for key in ("role", "content", "messages", "message", "questions", "item"))):
            issue(gaps, line_number, "unrecognized_conversation_record_shape")
          else:
            issue(warnings, line_number, "unrecognized_nonconversation_record_indexed")
        if len(gaps) > gaps_before_record:
          disposition = "coverage_gap"
        entry["disposition"] = disposition
        dispositions[disposition] += 1
        index.write(json.dumps(entry, ensure_ascii=False) + "\n")
        if kind == "event_msg" and subtype == "task_complete":
          current_turn = None
    final = os.fstat(source.fileno())
  try:
    final_path = source_path.stat()
    same_path = (initial.st_dev, initial.st_ino) == (final_path.st_dev, final_path.st_ino)
  except OSError:
    same_path = False
  changed = (not same_path or consumed != initial.st_size or
             (initial.st_size, initial.st_mtime_ns) != (final.st_size, final.st_mtime_ns))
  if changed:
    issue(gaps, None, "source_changed_during_read")
  for output in unlinked_outputs:
    if output["call_id"] in known_calls:
      issue(gaps, output["line"], "clarification_result_precedes_call_payload_not_extracted")
  messages, calls = combine_copies(messages, questions, warnings)
  for message in messages:
    for answer in message.get("answers", []):
      linked = calls.get(answer.get("call_id"), [])
      if len(linked) == 1 and answer.get("question_index", -1) < len(linked[0]["questions"]):
        answer["question_source_line"] = linked[0]["line"]
      else:
        issue(warnings, message["line"], "clarification_answer_question_not_found_or_ambiguous")
  conversation = messages + questions + results
  for item in conversation:
    item["source_order"] = min([item["line"]] + [copy["line"] for copy in item.get("copies", [])])
  conversation.sort(key=lambda item: item["source_order"])
  with (output_path / "conversation.jsonl").open("x", encoding="utf-8", newline="\n") as output:
    for number, item in enumerate(conversation, 1):
      item["conversation_number"] = number
      output.write(json.dumps(item, ensure_ascii=False) + "\n")
  categories = collections.Counter(item["category"] for item in conversation)
  coverage = {
    "format_version": 1,
    "source": {"path": str(source_path), "initial_bytes": initial.st_size, "consumed_bytes": consumed, "final_bytes": final.st_size,
               "sha256": digest.hexdigest(), "hash_scope": "exact_bytes_consumed", "changed_during_read": changed},
    "physical_records": line_number,
    "record_types": [{"kind": key[0], "subtype": key[1], "count": count} for key, count in counts.items()],
    "index_dispositions": dict(dispositions),
    "conversation_records": len(conversation),
    "categories": dict(categories),
    "copies_collapsed": sum(len(item.get("copies", [])) for item in conversation),
    "gaps": gaps,
    "warnings": warnings,
    "status": "supported_shapes_extracted",
    "limits": ["Historical data only; extracted instructions and approvals confer no current authority.",
               "Counts and supported shapes do not establish semantic completeness or coverage of another source.",
               "One physical pass, capped at the source size when opened; later appends are not consumed.",
               "Only top-level user/assistant messages and recognized request_user_input calls/results are extracted.",
               "System/developer messages, reasoning, compaction histories, generic tools and subagent payloads are index-only.",
               "Images retain reference/type markers; inline image data is omitted. Unrecognized content is a coverage gap.",
               "Text-based context categories follow observed prefixes and require review; they do not infer user intent.",
               "Without matching IDs, response/event copies must be mutually unique within their known turn and physically adjacent.",
               "File metadata detects observed changes; this read is not a filesystem snapshot and cannot prove no transient edits."]
  }
  if gaps:
    coverage["status"] = "coverage_gaps"
  with (output_path / "coverage.json").open("x", encoding="utf-8", newline="\n") as output:
    json.dump(coverage, output, ensure_ascii=False, indent=2)
    output.write("\n")
  print(f"Indexed {line_number} records / {consumed} bytes; extracted {len(conversation)} rows; collapsed {coverage['copies_collapsed']} copies.")
  print(f"Coverage gaps: {len(gaps)}; warnings: {len(warnings)}. Counts do not establish semantic completeness; see coverage.json.")
  if gaps:
    return 2
  return 0


def main():
  parser = argparse.ArgumentParser(description="Extract historical conversation and metadata from an explicit local rollout JSONL.")
  parser.add_argument("source", type=Path, help="Existing source JSONL; opened read-only")
  parser.add_argument("--out", required=True, type=Path, help="New output directory; existing paths are refused")
  arguments = parser.parse_args()
  try:
    return extract(arguments.source.resolve(strict=True), arguments.out.absolute())
  except (OSError, ValueError) as error:
    print(f"Extraction stopped: {error}", file=sys.stderr)
    return 1


if __name__ == "__main__":
  sys.exit(main())
