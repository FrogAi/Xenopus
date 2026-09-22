const WORK_ROWS = ['AssistantMessage', 'ToolUse', 'ToolResult', 'ToolGroup', 'TurnDuration']

const KEPT_SESSIONS = 30

function span(durationMs) {
  const seconds = Math.floor(durationMs / 1000)
  const units = [
    [Math.floor(seconds / 3600), 'h'],
    [Math.floor((seconds % 3600) / 60), 'm'],
    [seconds % 60, 's'],
  ]

  const shown = units.filter(([amount]) => amount > 0)

  if (shown.length === 0) {
    return '0s'
  }

  return shown.map(([amount, unit]) => amount + unit).join(' ')
}

function textKey(text) {
  let hash = 2166136261

  for (let index = 0; index < text.length; index += 1) {
    hash = Math.imul(hash ^ text.charCodeAt(index), 16777619)
  }

  return text.length + ':' + (hash >>> 0)
}

function rowId(e) {
  if (e.component === 'ToolGroup') {
    return e.props.calls[0]?.tool_use_id ?? e.requestId.split('collapsed-').pop()
  }

  if (e.component === 'ToolUse' || e.component === 'ToolResult') {
    return e.props.tool_use_id
  }

  return e.requestId
}

function isFolded(turn) {
  return !turn.isStopped && turn.answer.length > 0 && turn.rows[0] !== turn.answer[0]
}

function isFoldedOnDesktop(table, turn) {
  if (!isFolded(turn)) {
    return false
  }

  const answerRow = table.rowOfText.get(turn.textKeys[turn.answer[0]])
  return answerRow?.turn === turn
}

function remember(table, turn) {
  table.turns.push(turn)

  for (const id of turn.rows) {
    table.turnOfRow.set(id, turn)
  }

  if (turn.durationRow !== undefined) {
    table.turnOfRow.set(turn.durationRow, turn)
  }

  for (const [id, key] of Object.entries(turn.textKeys)) {
    let owner = { turn, id }

    if (table.rowOfText.has(key)) {
      owner = undefined
    }

    table.rowOfText.set(key, owner)
  }
}

async function load($, table, startedSessionId) {
  const sessionId = startedSessionId ?? (await $.session.id())

  const saved = (await $.store.get('turns:' + sessionId)) ?? []

  table.sessionId = sessionId

  table.turns = []

  table.turnOfRow = new Map()

  table.rowOfText = new Map()

  table.running = undefined

  for (const turn of saved) {
    remember(table, { textKeys: {}, ...turn, isOpen: false, host: Infinity })
  }
}

async function save($, table) {
  const savedTurns = []

  for (const turn of table.turns) {
    savedTurns.push({
      rows: turn.rows,
      answer: turn.answer,
      textKeys: turn.textKeys,
      durationRow: turn.durationRow,
      durationMs: turn.durationMs,
      isStopped: turn.isStopped,
    })
  }

  const storedSessions = (await $.store.get('sessions')) ?? []
  const sessions = storedSessions.filter((id) => id !== table.sessionId)

  sessions.push(table.sessionId)

  const dropped = sessions.splice(0, sessions.length - KEPT_SESSIONS)

  for (const id of dropped) {
    await $.store.delete('turns:' + id)
  }

  await $.store.set('sessions', sessions)

  await $.store.set('turns:' + table.sessionId, savedTurns)
}

function foldToggle($, e, turn) {
  const { Box, Button } = $.ui.resolve(e)

  let chevron = ' ▸'

  if (turn.isOpen) {
    chevron = ' ▾'
  }

  const toggle = Button({
    key: 'fold',
    label: 'Worked for ' + span(turn.durationMs) + chevron,
    plain: true,
    dimColor: true,
    onPress: () => {
      turn.isOpen = !turn.isOpen

      $.ui.invalidate('ui.render')
    },
  })

  return Box({ marginTop: 1, children: [toggle] })
}

function stoppedLabel($, e, turn) {
  const { Box, Text } = $.ui.resolve(e)

  const label = Text({ dimColor: true, children: ['You stopped after ' + span(turn.durationMs)] })
  return Box({ marginTop: 1, children: [label] })
}

// The desktop app draws tool calls itself and gives no thinking to draw, so there the fold only holds the text written before the
// answer; a turn with none has nothing to open.
function desktopHeader($, e, turn) {
  const hasTextBeforeAnswer = Object.keys(turn.textKeys).some((id) => !turn.answer.includes(id))

  if (hasTextBeforeAnswer) {
    return foldToggle($, e, turn)
  }

  const { Box, Text } = $.ui.resolve(e)

  const label = Text({ dimColor: true, children: ['Worked for ' + span(turn.durationMs)] })
  return Box({ marginTop: 1, children: [label] })
}

export function register(on) {
  const table = {
    sessionId: undefined,
    turns: [],
    turnOfRow: new Map(),
    rowOfText: new Map(),
    running: undefined,
    loaded: undefined,
    isDetailed: false,
  }

  on('classic.SessionStart', { source: ['clear', 'resume', 'fork'] }, async ($, e, next) => {
    table.loaded = load($, table, e.session_id)

    await table.loaded

    $.ui.invalidate('ui.render')

    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    await (table.loaded ??= load($, table))

    table.running = {
      rows: [],
      answer: [],
      textKeys: {},
      durationRow: undefined,
      durationMs: 0,
      isStopped: false,
      isOpen: false,
      host: Infinity,
    }

    return next(e)
  })

  on('session.append', async ($, e, next) => {
    const turn = table.running

    if (turn === undefined || e.agentId !== undefined) {
      return next(e)
    }

    if (e.message.name === 'turn_duration') {
      turn.durationRow = e.uuid
    }

    if (e.door !== 'response') {
      return next(e)
    }

    for (const block of e.message.content) {
      if (block.type === 'text') {
        turn.rows.push(e.uuid)

        turn.answer.push(e.uuid)

        turn.textKeys[e.uuid] = textKey(block.text)
      }

      if (block.type === 'tool_use') {
        turn.rows.push(block.id)

        turn.answer = []
      }
    }

    return next(e)
  })

  on('turn.complete', async ($, e, next) => {
    const turn = table.running

    if (turn === undefined || e.agentId !== undefined) {
      return next(e)
    }

    turn.durationMs = e.durationMs

    turn.isStopped = e.isAborted

    const result = await next(e)

    table.running = undefined

    remember(table, turn)

    $.ui.invalidate('ui.render')

    await save($, table)

    return result
  })

  on('ui.render', { component: 'UserMessage', surface: 'terminal' }, async ($, e, next) => {
    if (
      e.viewport?.isFullscreen !== false &&
      e.props.origin.kind === 'composer' &&
      e.props.isExpanded !== table.isDetailed
    ) {
      table.isDetailed = e.props.isExpanded

      $.ui.invalidate('ui.render')
    }

    return next(e)
  })

  on('ui.render', { component: WORK_ROWS, surface: 'terminal' }, async ($, e, next) => {
    if (e.viewport?.isFullscreen === false) {
      return next(e)
    }

    await (table.loaded ??= load($, table))

    const id = rowId(e)

    const turn = table.turnOfRow.get(id)

    if (turn === undefined || table.isDetailed) {
      return next(e)
    }

    if (!turn.isStopped && (!isFolded(turn) || turn.answer.includes(id))) {
      return next(e)
    }

    const index = turn.rows.indexOf(id)

    if (index !== -1 && index < turn.host && e.component !== 'ToolResult') {
      if (turn.host !== Infinity) {
        $.ui.invalidate('ui.render')
      }

      turn.host = index
    }

    const isHost = index === turn.host && e.component !== 'ToolResult'

    const { Box } = $.ui.resolve(e)

    if (turn.isStopped) {
      if (!isHost) {
        return next(e)
      }

      const label = stoppedLabel($, e, turn)

      const content = await next(e)
      return Box({ flexDirection: 'column', children: [label, content] })
    }

    if (!isHost) {
      if (turn.isOpen) {
        return next(e)
      }

      return Box({ children: [] })
    }

    const children = [foldToggle($, e, turn)]

    if (turn.isOpen) {
      children.push(await next(e))
    }

    return Box({ flexDirection: 'column', children })
  })

  on('ui.render', { component: 'AssistantMessage', surface: 'desktop' }, async ($, e, next) => {
    await (table.loaded ??= load($, table))

    const row = table.rowOfText.get(textKey(e.props.text))

    if (row === undefined) {
      return next(e)
    }

    const { turn, id } = row

    const { Box } = $.ui.resolve(e)

    if (turn.isStopped) {
      if (id !== Object.keys(turn.textKeys)[0]) {
        return next(e)
      }

      const label = stoppedLabel($, e, turn)

      const content = await next(e)
      return Box({ flexDirection: 'column', children: [label, content] })
    }

    if (!isFoldedOnDesktop(table, turn)) {
      return next(e)
    }

    if (id === turn.answer[0]) {
      const header = desktopHeader($, e, turn)
      return Box({ flexDirection: 'column', children: [header, await next(e)] })
    }

    if (turn.answer.includes(id) || turn.isOpen) {
      return next(e)
    }

    return Box({ children: [] })
  })
}
