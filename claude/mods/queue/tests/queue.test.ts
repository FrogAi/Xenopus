import { expect, mock, test } from 'claude-code/testing'

const COMPOSER = { origin: { kind: 'composer' }, wait: false } as const
const BAND = {
  plugin: 'queue',
  component: 'AbovePrompt',
  requestId: 'above-prompt',
  viewport: { columns: 100, rows: 30 },
  props: { hasSurvey: false, isWorking: false, maxRows: 12, bodyColumns: 42, scroll: { offset: 0, bodyRows: 1 }, view: {} },
} as const

// Stands in for the engine: runs the UserPromptSubmit hooks beneath prompt.submit and records what entered the session.
function engine($, on, surface, stored = {}, transcriptDelay = 0) {
  const state = { entered: [] as string[], contexts: {} as Record<string, readonly string[] | undefined>, isBlockingPlugin: false }
  mock.store(on, stored)
  mock.clock(on)
  on('session.start', () => ({ cwd: '/work' }))
  on('session.id', () => ({ value: 'session-1' }))
  on('session.surfaces', () => ({ value: [surface] }))
  on('session.messages', async () => {
    await new Promise((resolve) => setTimeout(resolve, transcriptDelay))
    return { value: state.entered.map((text) => ({ role: 'user', text, toolUses: [] })) }
  })
  on('ui.log', () => ({ value: undefined }))
  on('prompt.fill', () => ({ isFilled: true }))
  on('ui.render', () => ({ type: 'Text', props: {}, children: ['drawn by Claude Code'] }))
  on('turn.start', (_, e) => ({ turnId: e.turnId }))
  on('turn.step', async function* (_, e) {
    return { turnId: e.turnId, index: e.index, answer: '', toolUses: [], stopReason: 'end_turn', usage: null }
  })
  on('turn.complete', () => ({ text: '' }))
  on('classic.UserPromptSubmit', () => ({}))
  on('prompt.submit', async (_, e) => {
    if (state.isBlockingPlugin && e.origin.kind === 'plugin') return { drop: 'blocked by another hook' }
    const classic = await $.classic.UserPromptSubmit({ prompt: e.text })
    if (classic.preventContinuation) return { drop: 'Operation stopped by hook' }
    state.entered.push(e.text)
    state.contexts[e.text] = e.context
    return { text: e.text }
  })
  return state
}

async function settle() {
  await new Promise((resolve) => setTimeout(resolve, 50))
}

async function endTurn($, turnId, reason = 'answer') {
  await $.turn.complete({ turnId, answer: 'done', durationMs: 1, isAborted: reason === 'aborted', reason, usage: null })
  await settle()
}

async function startCount($, surface) {
  await $.session.start({ surface, isInteractive: true, cwd: '/work' })
  await $.prompt.submit({ text: 'count', ...COMPOSER })
  await $.turn.start({ text: 'count', turnId: 't1' })
}

// The desktop app draws a bubble for a message the moment it is sent.
async function drawBubble($, requestId, text) {
  return $.ui.mount({
    plugin: 'queue',
    component: 'UserMessage',
    requestId,
    surface: 'desktop',
    viewport: { columns: 100, rows: 30 },
    props: { text, origin: { kind: 'sdk' }, isExpanded: true },
  })
}

test('desktop: held messages come back as one prompt and run one per turn', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')

  for (const text of ['say apple', 'say banana', 'say orange']) {
    const held = await $.prompt.submit({ text, turnId: 't1', ...COMPOSER })
    expect(held.drop).toBe('Operation stopped by hook')
  }
  await endTurn($, 't1')
  expect(state.entered).toEqual(['count'])

  await $.prompt.submit({ text: 'say apple\nsay banana\nsay orange', ...COMPOSER })
  expect(state.entered).toEqual(['count', 'say apple'])
  await $.turn.start({ text: 'say apple', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say apple', 'say banana'])
  await $.turn.start({ text: 'say banana', turnId: 't3' })
  await endTurn($, 't3')
  expect(state.entered).toEqual(['count', 'say apple', 'say banana', 'say orange'])
  await $.turn.start({ text: 'say orange', turnId: 't4' })
  await endTurn($, 't4')
  expect(state.entered).toEqual(['count', 'say apple', 'say banana', 'say orange'])
})

test('desktop: text sent after the last tool call with no bubble seen is queued as one message', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple\n\nsay kiwi', ...COMPOSER })
  await $.turn.start({ text: 'say apple', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say apple', 'say kiwi'])
})

test('desktop: messages sent after the last tool call run one per turn behind the held ones', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say apple')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await drawBubble($, 'u2', 'say kiwi\nand lime')
  await drawBubble($, 'u3', 'say plum')
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple\nsay kiwi\nand lime\nsay plum', ...COMPOSER })
  await $.turn.start({ text: 'say apple', turnId: 't2' })
  await endTurn($, 't2')
  await $.turn.start({ text: 'say kiwi\nand lime', turnId: 't3' })
  await endTurn($, 't3')
  expect(state.entered).toEqual(['count', 'say apple', 'say kiwi\nand lime', 'say plum'])
})

test('desktop: two messages sent during a turn with no tool call run one per turn', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say apple')
  await drawBubble($, 'u2', 'say banana')
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple\nsay banana', ...COMPOSER })
  expect(state.entered).toEqual(['count', 'say apple'])
  await $.turn.start({ text: 'say apple', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say apple', 'say banana'])
})

test('desktop: a prompt typed while idle that only begins like an old bubble runs as typed', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say')
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple', ...COMPOSER })
  expect(state.entered).toEqual(['count', 'say apple'])
})

test('desktop: late messages are kept, not sent, when the turn they waited on fails', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say apple')
  await drawBubble($, 'u2', 'say banana')
  await endTurn($, 't1', 'error')

  const paused = await $.prompt.submit({ text: 'say apple\nsay banana', ...COMPOSER })
  expect(paused.drop).toBe('queue paused because the last turn failed')
  expect(state.entered).toEqual(['count'])
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await band.press({ key: 'resume' })
  await settle()
  expect(state.entered).toEqual(['count', 'say apple'])
})

test('desktop: a prompt typed while idle runs on its own even when an old bubble has the same text', async ($, on) => {
  const state = engine($, on, 'desktop')
  state.entered.push('continue')
  await startCount($, 'desktop')
  await drawBubble($, 'old', 'continue')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1', 'aborted')
  await $.prompt.submit({ text: 'say apple', ...COMPOSER })

  await drawBubble($, 'new', 'continue')
  await $.prompt.submit({ text: 'continue', ...COMPOSER })
  await $.turn.start({ text: 'continue', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['continue', 'count', 'continue'])
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await band.press({ key: 'resume' })
  await settle()
  expect(state.entered).toEqual(['continue', 'count', 'continue', 'say apple'])
})

test('desktop: an interrupt with nothing queued does not pause messages queued in a later turn', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await endTurn($, 't1', 'aborted')

  await $.prompt.submit({ text: 'count again', origin: { kind: 'task-notification' }, wait: false })
  await $.turn.start({ text: 'count again', turnId: 't2' })
  await $.prompt.submit({ text: 'say apple', turnId: 't2', ...COMPOSER })
  await endTurn($, 't2')
  await $.prompt.submit({ text: 'say apple', ...COMPOSER })
  expect(state.entered).toEqual(['count', 'count again', 'say apple'])
})

test('desktop: a message queued during a queued turn keeps its place in line', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await $.prompt.submit({ text: 'say banana', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1')
  await $.prompt.submit({ text: 'say apple\nsay banana', ...COMPOSER })
  await $.turn.start({ text: 'say apple', turnId: 't2' })
  await $.prompt.submit({ text: 'say plum', turnId: 't2', ...COMPOSER })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say apple'])

  await $.prompt.submit({ text: 'say plum', ...COMPOSER })
  expect(state.entered).toEqual(['count', 'say apple', 'say banana'])
  await $.turn.start({ text: 'say banana', turnId: 't3' })
  await endTurn($, 't3')
  expect(state.entered).toEqual(['count', 'say apple', 'say banana', 'say plum'])
})

test('desktop: an interrupt pauses the queue and a new prompt runs on its own until Resume is pressed', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1', 'aborted')

  const paused = await $.prompt.submit({ text: 'say apple', ...COMPOSER })
  expect(paused.drop).toBe('queue paused because you interrupted')
  expect(state.entered).toEqual(['count'])

  await $.prompt.submit({ text: 'carry on', ...COMPOSER })
  await $.turn.start({ text: 'carry on', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'carry on'])
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await band.press({ key: 'resume' })
  await settle()
  expect(state.entered).toEqual(['count', 'carry on', 'say apple'])
})

test('desktop: a paused queue says when the pictures of a returned message were not kept', async ($, on) => {
  engine($, on, 'desktop')
  await startCount($, 'desktop')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER, ...IMAGE })
  await endTurn($, 't1', 'error')

  const paused = await $.prompt.submit({ text: 'say apple', ...COMPOSER, ...IMAGE })
  expect(paused.drop).toBe('queue paused because the last turn failed, and its pictures were not kept, so attach them again')
})

test('desktop: a turn that fails pauses the queue until Resume is pressed', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await $.prompt.submit({ text: 'say banana', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1', 'error')

  const paused = await $.prompt.submit({ text: 'say apple\nsay banana', ...COMPOSER })
  expect(paused.drop).toBe('queue paused because the last turn failed')
  expect(state.entered).toEqual(['count'])

  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await band.find({ type: 'Text', text: 'Queue paused because the last turn failed' })).toBeDefined()
  await band.press({ key: 'resume' })
  await settle()
  expect(state.entered).toEqual(['count', 'say apple'])
  await $.turn.start({ text: 'say apple', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say apple', 'say banana'])
})

test('desktop: a prompt that is not the held messages runs as typed', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'something else', ...COMPOSER })
  await $.turn.start({ text: 'something else', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'something else', 'say apple'])
})

test('desktop: a deleted message is skipped when the engine sends it back', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await $.prompt.submit({ text: 'say banana', turnId: 't1', ...COMPOSER })
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await band.press({ key: 'delete-0' })
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple\nsay banana', ...COMPOSER })
  await $.turn.start({ text: 'say banana', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say banana'])
})

test('desktop: a message is listed as soon as its bubble appears, and the bubble is drawn empty', async ($, on) => {
  engine($, on, 'desktop')
  await startCount($, 'desktop')
  const sent = await drawBubble($, 'u1', 'say apple')
  expect(await sent.find({ type: 'Text', text: 'drawn by Claude Code' })).toBeUndefined()
  await drawBubble($, 'u2', 'say banana')

  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await band.find({ type: 'Text', text: 'say apple' })).toBeDefined()
  expect(await band.find({ type: 'Text', text: 'say banana' })).toBeDefined()
})

test('desktop: a bubble whose text the transcript already holds is left as it is', async ($, on) => {
  engine($, on, 'desktop')
  await startCount($, 'desktop')
  const old = await drawBubble($, 'old', 'count')
  expect(await old.find({ type: 'Text', text: 'drawn by Claude Code' })).toBeDefined()

  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await band.find({ type: 'Text', text: 'count' })).toBeUndefined()
})

test('desktop: a listed message deleted before the engine offers it is held but never run', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say apple')
  await drawBubble($, 'u2', 'say banana')
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await band.press({ key: 'delete-0' })
  const held = await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  expect(held.drop).toBe('Operation stopped by hook')
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple\nsay banana', ...COMPOSER })
  await $.turn.start({ text: 'say banana', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say banana'])
})

test('desktop: a listed message the engine never offered is skipped once deleted', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say apple')
  await drawBubble($, 'u2', 'say banana')
  await drawBubble($, 'u3', 'say plum')
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await band.press({ key: 'delete-1' })
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple\nsay banana\nsay plum', ...COMPOSER })
  await $.turn.start({ text: 'say apple', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say apple', 'say plum'])
})

test('desktop: two identical messages run as two turns', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'test')
  await drawBubble($, 'u2', 'test')
  await $.prompt.submit({ text: 'test', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'test\ntest', ...COMPOSER })
  expect(state.entered).toEqual(['count', 'test'])
  await $.turn.start({ text: 'test', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'test', 'test'])
})

const IMAGE = { attachments: [{ type: 'image', mediaType: 'image/png' }] } as const
const IMAGE_ROW = '[Image: source: C:/images/15.png]'

test('desktop: the first message of a batch that came back with images is told they may belong to a later one', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say apple')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await drawBubble($, 'u2', 'what is in the screenshot?')
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple\nwhat is in the screenshot?', ...COMPOSER, ...IMAGE })
  expect(state.contexts['say apple']?.[0]).toMatch(/leave them for the message they belong to/)
  await $.turn.start({ text: 'say apple', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say apple', 'what is in the screenshot?'])
})

test('desktop: a single returned message keeps its image with no note', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'what is in the screenshot?')
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'what is in the screenshot?', ...COMPOSER, ...IMAGE })
  expect(state.entered).toEqual(['count', 'what is in the screenshot?'])
  expect(state.contexts['what is in the screenshot?']).toBeUndefined()
})

test('desktop: a screenshot sent on its own before other messages does not stop them being split', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u0', '')
  await drawBubble($, 'u1', 'say apple')
  await drawBubble($, 'u2', 'say banana')
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple\nsay banana', ...COMPOSER, ...IMAGE })
  expect(state.entered).toEqual(['count', 'say apple'])
  await $.turn.start({ text: 'say apple', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say apple', 'say banana'])
})

test('a stored message that came with images is sent with their locations after a restart', async ($, on) => {
  const state = engine($, on, 'desktop', { 'queue:session-1': { items: [{ text: 'what is in the screenshot?', images: [IMAGE_ROW] }] } })
  await $.session.start({ surface: 'desktop', isInteractive: true, cwd: '/work' })
  await settle()
  expect(state.entered).toEqual(['what is in the screenshot?'])
  expect(state.contexts['what is in the screenshot?']?.[0]).toContain(IMAGE_ROW)
})

test('desktop: a message offered while its bubble is still being drawn is listed once and clears', async ($, on) => {
  const state = engine($, on, 'desktop', {}, 30)
  await startCount($, 'desktop')
  const drawing = drawBubble($, 'u1', 'say apple')
  await new Promise((resolve) => setTimeout(resolve, 5))
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await drawing
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await band.find({ key: 'delete-1' })).toBeUndefined()
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple', ...COMPOSER })
  await $.turn.start({ text: 'say apple', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say apple'])
  expect(await band.find({ key: 'delete-0' })).toBeUndefined()
})

test('desktop: an old row drawn mid-turn does not split a later message or stay waiting', async ($, on) => {
  const state = engine($, on, 'desktop')
  state.entered.push('yes')
  await startCount($, 'desktop')
  await drawBubble($, 'old', 'yes')
  await drawBubble($, 'u1', 'fix it')
  await $.prompt.submit({ text: 'fix it', turnId: 't1', ...COMPOSER })
  await drawBubble($, 'u2', 'yes\nplease do it')
  await drawBubble($, 'u3', 'say plum')
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'fix it\nyes\nplease do it\nsay plum', ...COMPOSER })
  await $.turn.start({ text: 'fix it', turnId: 't2' })
  await endTurn($, 't2')
  await $.turn.start({ text: 'yes\nplease do it', turnId: 't3' })
  await endTurn($, 't3')
  expect(state.entered).toEqual(['yes', 'count', 'fix it', 'yes\nplease do it', 'say plum'])
})

test('desktop: a stored message with image locations keeps its note when the engine carries it', async ($, on) => {
  const state = engine($, on, 'desktop', {
    'queue:session-1': { items: [{ text: 'what is in the screenshot?', images: [IMAGE_ROW] }], pausedBecause: 'you interrupted' },
  })
  await $.session.start({ surface: 'desktop', isInteractive: true, cwd: '/work' })
  await $.prompt.submit({ text: 'count', ...COMPOSER })
  await $.turn.start({ text: 'count', turnId: 't1' })
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await band.press({ key: 'resume' })
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple', ...COMPOSER })
  expect(state.entered).toEqual(['count', 'what is in the screenshot?'])
  expect(state.contexts['what is in the screenshot?']?.[0]).toContain(IMAGE_ROW)
})

test('desktop: the first message is told about images when another message of its group was deleted', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say apple')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await drawBubble($, 'u2', 'what is in the screenshot?')
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await band.press({ key: 'delete-1' })
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple\nwhat is in the screenshot?', ...COMPOSER, ...IMAGE })
  expect(state.entered).toEqual(['count', 'say apple'])
  expect(state.contexts['say apple']?.[0]).toMatch(/leave them for the message they belong to/)
})

test('desktop: each message shows on its own line with up and down where it can move', async ($, on) => {
  engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say apple')
  await drawBubble($, 'u2', 'say banana')
  await drawBubble($, 'u3', 'say plum')

  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await band.find({ type: 'Text', text: 'say banana' })).toBeDefined()
  expect(await band.find({ key: 'up-0' })).toBeUndefined()
  expect(await band.find({ key: 'down-0' })).toBeDefined()
  expect(await band.find({ key: 'up-2' })).toBeDefined()
  expect(await band.find({ key: 'down-2' })).toBeUndefined()
})

test('desktop: messages reordered while the engine still has them run in the new order', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say apple')
  await drawBubble($, 'u2', 'say banana')
  await drawBubble($, 'u3', 'say plum')
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await band.press({ key: 'down-0' })
  await band.press({ key: 'up-2' })
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple\nsay banana\nsay plum', ...COMPOSER })
  expect(state.entered).toEqual(['count', 'say banana'])
  await $.turn.start({ text: 'say banana', turnId: 't2' })
  await endTurn($, 't2')
  await $.turn.start({ text: 'say plum', turnId: 't3' })
  await endTurn($, 't3')
  expect(state.entered).toEqual(['count', 'say banana', 'say plum', 'say apple'])
})

test('desktop: a message moved ahead of the one the engine holds waits for the engine to send it back', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say apple')
  await drawBubble($, 'u2', 'say banana')
  await endTurn($, 't1')
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await band.press({ key: 'up-1' })
  await settle()
  expect(state.entered).toEqual(['count'])

  await $.prompt.submit({ text: 'say apple\nsay banana', ...COMPOSER })
  expect(state.entered).toEqual(['count', 'say banana'])
})

test('terminal: queued messages can be reordered', async ($, on) => {
  const state = engine($, on, 'terminal')
  await startCount($, 'terminal')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await $.prompt.submit({ text: 'say banana', turnId: 't1', ...COMPOSER })
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  await band.press({ key: 'up-1' })
  await endTurn($, 't1')
  await $.turn.start({ text: 'say banana', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say banana', 'say apple'])
})

test('desktop: a repeated short message keeps its place among messages sent after it', async ($, on) => {
  const state = engine($, on, 'desktop')
  state.entered.push('yes')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'yes')
  await drawBubble($, 'u2', 'say plum')
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'yes\nsay plum', ...COMPOSER })
  await $.turn.start({ text: 'yes', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['yes', 'count', 'yes', 'say plum'])
})

test('desktop: a repeated short message offered by the engine keeps its place too', async ($, on) => {
  const state = engine($, on, 'desktop')
  state.entered.push('yes')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'yes')
  await drawBubble($, 'u2', 'say plum')
  await $.prompt.submit({ text: 'yes', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'yes\nsay plum', ...COMPOSER })
  await $.turn.start({ text: 'yes', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['yes', 'count', 'yes', 'say plum'])
})

test('desktop: a message with an attachment is held and queued like any other', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'what is this?')
  await drawBubble($, 'u2', 'say banana')
  const held = await $.prompt.submit({ text: 'what is this?', turnId: 't1', ...COMPOSER, ...IMAGE })
  expect(held.drop).toBe('Operation stopped by hook')
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await band.find({ key: 'delete-2' })).toBeUndefined()
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'what is this?\nsay banana', ...COMPOSER, ...IMAGE })
  await $.turn.start({ text: 'what is this?', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'what is this?', 'say banana'])
})

test('desktop: a slash command sent mid-turn is left to the engine and leaves the list', async ($, on) => {
  engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', '/compact')
  await $.prompt.submit({ text: '/compact', turnId: 't1', ...COMPOSER })
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await band.find({ type: 'Text', text: '/compact' })).toBeUndefined()
})

test('desktop: every queued message is listed with its buttons, however many there are', async ($, on) => {
  engine($, on, 'desktop')
  await startCount($, 'desktop')
  for (let index = 1; index <= 7; index += 1) await drawBubble($, 'u' + index, 'message ' + index)
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await band.find({ type: 'Text', text: 'message 7' })).toBeDefined()
  expect(await band.find({ key: 'delete-6' })).toBeDefined()
})

test('after a restart, messages that were still with the engine are sent by the queue', async ($, on) => {
  const state = engine($, on, 'desktop', { 'queue:session-1': { items: [{ text: 'say apple', row: 'u1' }, { text: 'say banana', row: 'u2' }] } })
  await $.session.start({ surface: 'desktop', isInteractive: true, cwd: '/work' })
  await settle()
  expect(state.entered).toEqual(['say apple'])
  await $.turn.start({ text: 'say apple', turnId: 't1' })
  await endTurn($, 't1')
  expect(state.entered).toEqual(['say apple', 'say banana'])
})

test('desktop: an edited message goes back to the place it was taken from', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say apple')
  await drawBubble($, 'u2', 'say banana')
  await drawBubble($, 'u3', 'say plum')
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await band.press({ key: 'edit-1' })
  await drawBubble($, 'u4', 'say blueberry')
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple\nsay banana\nsay plum\nsay blueberry', ...COMPOSER })
  await $.turn.start({ text: 'say apple', turnId: 't2' })
  await endTurn($, 't2')
  await $.turn.start({ text: 'say blueberry', turnId: 't3' })
  await endTurn($, 't3')
  expect(state.entered).toEqual(['count', 'say apple', 'say blueberry', 'say plum'])
})

test('terminal: an edited message goes back to the place it was taken from', async ($, on) => {
  const state = engine($, on, 'terminal')
  await startCount($, 'terminal')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await $.prompt.submit({ text: 'say banana', turnId: 't1', ...COMPOSER })
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  await band.press({ key: 'edit-0' })
  await $.prompt.submit({ text: 'say apricot', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1')
  await $.turn.start({ text: 'say apricot', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say apricot', 'say banana'])
})

const TRACKED = { 'rows:session-1': { known: [], hidden: [] } }

test('desktop: in a chat followed from its start, a repeated short message is listed at once', async ($, on) => {
  const state = engine($, on, 'desktop', TRACKED)
  state.entered.push('yes')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'yes')
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await band.find({ type: 'Text', text: 'yes' })).toBeDefined()
})

test('desktop: a picture offered on its own is held, not queued, and comes back as its own prompt', async ($, on) => {
  const state = engine($, on, 'desktop', TRACKED)
  await startCount($, 'desktop')
  const held = await $.prompt.submit({ text: '', turnId: 't1', ...COMPOSER, ...IMAGE })
  expect(held.drop).toBe('Operation stopped by hook')
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  expect(await band.find({ key: 'delete-0' })).toBeUndefined()
  await endTurn($, 't1')

  await $.prompt.submit({ text: '', ...COMPOSER, ...IMAGE })
  expect(state.entered).toEqual(['count', ''])
})

test('desktop: deleting an earlier message after Edit still puts the resent message where the edited one was', async ($, on) => {
  const state = engine($, on, 'desktop', TRACKED)
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say apple')
  await drawBubble($, 'u2', 'say banana')
  await drawBubble($, 'u3', 'say plum')
  const band = await $.ui.mount({ ...BAND, surface: 'desktop' })
  await band.press({ key: 'edit-1' })
  await band.press({ key: 'delete-0' })
  await drawBubble($, 'u4', 'say blueberry')
  await endTurn($, 't1')

  await $.prompt.submit({ text: 'say apple\nsay banana\nsay plum\nsay blueberry', ...COMPOSER })
  await $.turn.start({ text: 'say blueberry', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say blueberry', 'say plum'])
})

test('terminal: an Edit made while idle does not move a message queued in the next turn', async ($, on) => {
  const state = engine($, on, 'terminal')
  await startCount($, 'terminal')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await $.prompt.submit({ text: 'say banana', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1', 'aborted')
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  await band.press({ key: 'edit-0' })

  await $.prompt.submit({ text: 'say apricot', ...COMPOSER })
  await $.turn.start({ text: 'say apricot', turnId: 't2' })
  await $.prompt.submit({ text: 'say kiwi', turnId: 't2', ...COMPOSER })
  await endTurn($, 't2')
  await band.press({ key: 'resume' })
  await settle()
  await $.turn.start({ text: 'say banana', turnId: 't3' })
  await endTurn($, 't3')
  expect(state.entered).toEqual(['count', 'say apricot', 'say banana', 'say kiwi'])
})

test('terminal: three messages sent mid-turn run in order, one per turn', async ($, on) => {
  const state = engine($, on, 'terminal')
  await startCount($, 'terminal')
  const queued = await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  expect(queued.drop).toBe('queued, 1 waiting')
  await $.prompt.submit({ text: 'say banana', turnId: 't1', ...COMPOSER })
  await $.prompt.submit({ text: 'say orange', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1')
  expect(state.entered).toEqual(['count', 'say apple'])
  await $.turn.start({ text: 'say apple', turnId: 't2' })
  await endTurn($, 't2')
  await $.turn.start({ text: 'say banana', turnId: 't3' })
  await endTurn($, 't3')
  expect(state.entered).toEqual(['count', 'say apple', 'say banana', 'say orange'])
})

test('terminal: an interrupt pauses the queue until Resume is pressed', async ($, on) => {
  const state = engine($, on, 'terminal')
  await startCount($, 'terminal')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1', 'aborted')
  expect(state.entered).toEqual(['count'])

  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await band.find({ type: 'Text', text: 'Queue paused because you interrupted' })).toBeDefined()
  await band.press({ key: 'resume' })
  await settle()
  expect(state.entered).toEqual(['count', 'say apple'])
})

test('terminal: a message whose send is blocked stays queued and is sent once Resume is pressed', async ($, on) => {
  const state = engine($, on, 'terminal')
  await startCount($, 'terminal')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  state.isBlockingPlugin = true
  await endTurn($, 't1')
  expect(state.entered).toEqual(['count'])

  state.isBlockingPlugin = false
  await $.prompt.submit({ text: 'go on', ...COMPOSER })
  await $.turn.start({ text: 'go on', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'go on'])
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  await band.press({ key: 'resume' })
  await settle()
  expect(state.entered).toEqual(['count', 'go on', 'say apple'])
})

test('a session reached by /resume sends the messages queued in it', async ($, on) => {
  const state = engine($, on, 'terminal', { 'queue:session-2': { items: [{ text: 'say apple' }] } })
  on('classic.SessionStart', () => ({}))
  await $.session.start({ surface: 'terminal', isInteractive: true, cwd: '/work' })
  await $.classic.SessionStart({ source: 'resume', session_id: 'session-2' })
  await settle()
  expect(state.entered).toEqual(['say apple'])
})

async function runStep($, turnId, index) {
  for await (const _ of $.turn.step({ turnId, index, model: 'claude', messageCount: 1 })) {}
}

// The test kit has no session.append, so the note a Steer appends is refused; what counts is whether a later request ran.
async function steerFirst($, surface) {
  const band = await $.ui.mount({ ...BAND, surface })
  await expect(band.press({ key: 'steer-0' })).rejects.toThrow('no implementation for session.append')
}

test('terminal: a message steered during the final answer is sent as the next prompt', async ($, on) => {
  const state = engine($, on, 'terminal')
  await startCount($, 'terminal')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await steerFirst($, 'terminal')
  await endTurn($, 't1')
  expect(state.entered).toEqual(['count', 'say apple'])
})

test('desktop: a message the engine holds that is steered during the final answer is sent once, as the next prompt', async ($, on) => {
  const state = engine($, on, 'desktop')
  await startCount($, 'desktop')
  await drawBubble($, 'u1', 'say apple')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await steerFirst($, 'desktop')
  await endTurn($, 't1')
  expect(state.entered).toEqual(['count'])

  await $.prompt.submit({ text: 'say apple', ...COMPOSER })
  await $.turn.start({ text: 'say apple', turnId: 't2' })
  await endTurn($, 't2')
  expect(state.entered).toEqual(['count', 'say apple'])
})

test('terminal: a message steered before another request is left to that request', async ($, on) => {
  const state = engine($, on, 'terminal')
  await startCount($, 'terminal')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await steerFirst($, 'terminal')
  await runStep($, 't1', 1)
  await endTurn($, 't1')
  expect(state.entered).toEqual(['count'])
})

test('terminal: a slash command typed while the queue is paused leaves it paused', async ($, on) => {
  const state = engine($, on, 'terminal')
  await startCount($, 'terminal')
  await $.prompt.submit({ text: 'say apple', turnId: 't1', ...COMPOSER })
  await endTurn($, 't1', 'aborted')

  await $.prompt.submit({ text: '/cost', ...COMPOSER })
  const band = await $.ui.mount({ ...BAND, surface: 'terminal' })
  expect(await band.find({ type: 'Text', text: 'Queue paused because you interrupted' })).toBeDefined()
  await band.press({ key: 'resume' })
  await settle()
  expect(state.entered).toEqual(['count', '/cost', 'say apple'])
})
