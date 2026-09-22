import { expect, mock, test } from 'claude-code/testing'

const VIEWPORT = { columns: 100, rows: 30, isFullscreen: true } as const
const MODEL = { kind: 'model', model: 'claude-test' } as const
const STORE_LIMIT = 4 * 1024 * 1024

// Stands in for the engine: answers what the mod passes on and the calls it makes.
function engine(on) {
  mock.store(on, {})
  on('session.id', () => ({ value: 'session-1' }))
  on('ui.render', () => ({ type: 'Text', props: {}, children: ['drawn by Claude Code'] }))
  on('turn.start', (_, e) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))
}

// The kit has nothing beneath session.append to keep a row, so the call rejects once the mod's hook has seen it.
async function append($, row) {
  await $.session.append(row).catch((error) => {
    if (!error.message.includes('no implementation for session.append')) {
      throw error
    }
  })
}

async function respond($, uuid, block) {
  await append($, { uuid, door: 'response', origin: MODEL, message: { type: 'assistant', role: 'assistant', content: [block] } })
}

async function durationRow($, uuid) {
  await append($, { uuid, door: 'notice', origin: { kind: 'engine' }, message: { type: 'system', name: 'turn_duration', content: [] } })
}

async function runTurn($, turnId, blocks) {
  await $.turn.start({ text: 'go', turnId })
  for (const [index, block] of blocks.entries()) {
    await respond($, turnId + '-' + index, block)
  }
  await durationRow($, turnId + '-duration')
  await $.turn.complete({ turnId, answer: '', durationMs: 4000, isAborted: false, reason: 'answer' })
}

function text(value) {
  return { type: 'text', text: value }
}

function toolUse(id) {
  return { type: 'tool_use', id, name: 'Bash', input: { command: 'ls' } }
}

async function mountRow($, surface, component, requestId, props) {
  return $.ui.mount({ plugin: 'collapse-work', surface, component, requestId, props, viewport: VIEWPORT })
}

async function mountReply($, surface, requestId, value) {
  return mountRow($, surface, 'AssistantMessage', requestId, { text: value, isFirstOfReply: true })
}

async function mountTool($, surface, id) {
  const props = { tool_use_id: id, tool: 'Bash', input: { command: 'ls' }, isRunning: false, isErrored: false, isInterrupted: false, output: 'ok' }
  return mountRow($, surface, 'ToolUse', id, props)
}

async function isEngineRow(row) {
  return (await row.find({ type: 'Text', text: 'drawn by Claude Code' })) !== undefined
}

test('terminal: the work before the answer folds under Worked for and opens on press', async ($, on) => {
  engine(on)
  await runTurn($, 't1', [text('Let me look'), toolUse('toolu_1'), text('The answer')])

  const before = await mountReply($, 'terminal', 't1-0', 'Let me look')
  expect(await before.find({ key: 'fold' })).toBeDefined()
  expect(await isEngineRow(before)).toBe(false)
  expect(await isEngineRow(await mountRow($, 'terminal', 'TurnDuration', 't1-duration', { word: 'Baked', durationMs: 4000 }))).toBe(false)
  expect(await isEngineRow(await mountReply($, 'terminal', 't1-2', 'The answer'))).toBe(true)

  await before.press({ key: 'fold' })
  expect(await isEngineRow(await mountTool($, 'terminal', 'toolu_1'))).toBe(true)
})

test('terminal: a turn with only thinking before its answer keeps its duration line', async ($, on) => {
  engine(on)
  await runTurn($, 't1', [{ type: 'thinking', thinking: 'hmm', signature: 'sig' }, text('Quick answer')])

  expect(await isEngineRow(await mountReply($, 'terminal', 't1-1', 'Quick answer'))).toBe(true)
  expect(await isEngineRow(await mountRow($, 'terminal', 'TurnDuration', 't1-duration', { word: 'Baked', durationMs: 4000 }))).toBe(true)
})

test('desktop: two turns ending in the same text leave the earlier turn\'s work on screen', async ($, on) => {
  engine(on)
  await runTurn($, 't1', [text('Checking 1'), toolUse('toolu_1'), text('Done.')])
  await runTurn($, 't2', [text('Checking 2'), toolUse('toolu_2'), text('Done.')])

  expect(await isEngineRow(await mountReply($, 'desktop', 'msg_a-t0', 'Checking 1'))).toBe(true)
  expect(await isEngineRow(await mountTool($, 'desktop', 'toolu_1'))).toBe(true)
})

test('a full store makes room by dropping the oldest session before saving a new one', async ($, on) => {
  const saved = new Map()
  const filler = 'x'.repeat(STORE_LIMIT / 30 - 100)
  const sessions = []
  for (let index = 0; index < 30; index += 1) {
    sessions.push('old-' + index)
    saved.set('turns:old-' + index, [{ rows: [filler] }])
  }
  saved.set('sessions', sessions)
  const room = STORE_LIMIT - JSON.stringify(Object.fromEntries(saved)).length
  saved.set('turns:old-29', [{ rows: [filler + 'x'.repeat(room - 50)] }])
  on('store.get', (_, e) => ({ value: saved.get(e.key) }))
  on('store.delete', (_, e) => {
    saved.delete(e.key)
    return { value: undefined }
  })
  on('store.set', (_, e) => {
    const next = new Map(saved)
    next.set(e.key, e.value)
    if (JSON.stringify(Object.fromEntries(next)).length > STORE_LIMIT) {
      return { deny: 'store over 4 MiB' }
    }
    saved.set(e.key, e.value)
    return { value: undefined }
  })
  on('session.id', () => ({ value: 'session-1' }))
  on('turn.start', (_, e) => ({ turnId: e.turnId }))
  on('turn.complete', () => ({ text: '' }))

  await runTurn($, 't1', [text('Let me look'), toolUse('toolu_1'), text('The answer')])
  expect(saved.has('turns:old-0')).toBe(false)
  expect(saved.has('turns:session-1')).toBe(true)
})
