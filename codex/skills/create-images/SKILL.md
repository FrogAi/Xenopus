---
name: create-images
description: Produce, edit, refine or repair AI-generated images (photos, banners, covers, illustrations) with image models such as Codex's built-in image generator, OpenAI's image API or ChatGPT, including composing several real subjects, fixing wrong anatomy or details, removing ghosts, seams, smudges and patches left by edits or compositing, raising detail and auditing results for AI artifacts. Use when the user asks to generate or edit a picture with AI, or to check an AI-made image for flaws. Not for resizing, cropping, converting or optimizing existing images, or for designing interface layouts.
---

# Create Images

Deliver an image that holds up as the real thing at full zoom, not one that only looks right as a thumbnail. Treat every subject the user cares about (their product, car, animal, person or place) as something to get exactly right from real evidence, and treat every artifact a careful viewer could notice as a defect.

Read [references/prompting.md](references/prompting.md) before writing any image prompt, [references/refinement-and-compositing.md](references/refinement-and-compositing.md) before refining, fixing or combining renders, and [references/review.md](references/review.md) before judging or presenting a result. `scripts/` holds working implementations of the paid API edit call and the compositor; adapt them rather than rewriting from scratch. They need Python 3 with Pillow, NumPy and OpenCV, plus requests for the API call (`pip install pillow numpy opencv-python requests`).

## Establish the image

Settle with the user what the image is for and how it will be shown (where text or interface will sit over it, which crops and screen sizes it must survive, light/dark or seasonal variants), the subjects and their exact identities, the mood, and what must never appear. Ask about choices that change the result; decide technical details yourself.

Gather real reference photos for every specific subject before generating: the exact product variant, trim and colour (a listing of the exact item beats nicer photos of a near match), each animal species, and any look or pose the user supplies. Keep a sources file with licences; private references stay private. Drop a reference that carries a wrong trait, because references outweigh text.

## Choose the generator

When you are signed in with a ChatGPT plan, use your built-in `image_gen` tool by default: it runs on that subscription, with no API charge. Load each local input with `view_image` first, say what each input is for, ask for one generation or edit per call, and copy each result from `$CODEX_HOME/generated_images` into the project under a given name. It picks its own output size and has no quality, mask or exact-size controls, so register its results to their source before placing them (see the refinement reference). Use the paid API (`scripts/render_piece.py`) only when the built-in tool fails, hits a usage limit or the job needs a control it lacks; estimate its cost and get the user's go-ahead before the first paid call.

## Compose first, then add detail

1. **Composition:** iterate on whole-scene prompts at the model's native size until layout, subjects, poses and placement are right. Judge each round at display size and zoomed in, show the user each candidate, and fold fixes into the next prompt rather than chaining edits. Freeze the approved layout as the blueprint.
2. **Detail:** when the delivery size is larger than one render covers sharply, or subjects come out melted, painterly or toy-like at full zoom (a whole-scene render spends too few pixels on each subject), redraw the blueprint section by section at full resolution, with one section per important subject and its own real references, then composite the sections into a master larger than the delivery size.
3. **Fixes:** change the blueprint or the section source, never paste repairs over the finished master, and re-render at the same scale as the neighbouring sections.

Make one request per change set and stop: chained or automatic follow-up edits re-render the whole image and degrade subjects that were fine. In chat interfaces that run extra passes on their own, ask for exactly one edit and no correction passes.

## Choose settings with evidence

Before committing a paid job of many renders to a model or quality level, render the same two or three representative pieces at each candidate level, compare them blind at delivery scale, and include the user in the blind comparison when the choice is theirs. Higher levels are not automatically better, and different content can favour different levels; a single image or a few renders doesn't need the comparison. Check the provider's current models, sizes, prices and rate limits in its own documentation, log every paid call's token usage and cost, and run independent calls in parallel up to the account's rate limit. Prefer the provider's batch mode when results can wait and cost matters.

## Files and recipe

Keep every working file, candidate, crop and preview as lossless PNG, because repeated edits of lossy files compound their damage; only delivery copies are compressed, always from the master. Keep the recipe beside the master: the scene prompt, section plan and prompts, references with sources, the chosen piece for each section and the scripts, so the image can be regenerated or improved with a better model later. Leave out intermediate tries and scratch.

## Finish

Before presenting a result as done, run the full-zoom artifact review in [references/review.md](references/review.md) by fresh eyes (the `image-artifact-reviewer` agent when available), fix what it confirms, and re-check the fixed areas; when the job produces the delivery copies, also run that reference's Delivery copies checks. Report what changed, what was checked, the cost, and any flaw you chose to leave with the reason.

## Improve this workflow

Route lessons that hold for any image job, and the user's corrections, through `$improve-personal-customizations`, working each into the section or reference that owns it; keep one project's choices (a style guide, a subject list, one image's recipe) with that project.
