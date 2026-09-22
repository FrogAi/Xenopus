const USER_ORIGINS = ['composer', 'sdk', 'bridge']

const KEPT_SESSIONS = 30

// The messages the engine is holding live as long as its process does, so they are kept where a reload of this module keeps them.
const HELD = { plugin: 'queue', key: 'held' }

const IMAGE_SOURCE = '[Image: source:'

// The engine sends waiting messages back as one prompt with every attachment on it, so which message an image came with is lost.
const IMAGES_ATTACHED_NOTE =
  'This message was queued with others while you were working. ' +
  'The attached images came with that group of queued messages, and the queue cannot tell which message they belong to. ' +
  'Use them here only if this message refers to an attachment or a screenshot; otherwise leave them for the message they belong to.'

const IMAGES_ELSEWHERE_NOTE =
  'This message was queued with others while you were working. ' +
  'These images were attached somewhere in that group of queued messages, and the queue cannot tell which message they belong to. ' +
  'If this message refers to an attachment or a screenshot, read the files:'

function redraw($) {
  $.ui.invalidate('ui.render')
}

async function save($, queue) {
  const key = 'queue:' + queue.sessionId

  if (queue.items.length === 0) {
    await $.store.delete(key)
    return
  }

  const items = queue.items.map((item) => {
    const saved = { text: item.text, images: item.images }

    if (item.bubble !== undefined) {
      saved.row = item.bubble.id ?? ''
    }

    return saved
  })

  await $.store.set(key, { items, pausedBecause: queue.pausedBecause })
}

// Keeps which rows of a session are old and which stay out of the chat, for the sessions used most recently.
async function saveRows($, queue, bubbles) {
  await $.store.set('rows:' + queue.sessionId, { known: [...bubbles.known], hidden: [...bubbles.hidden] })

  const stored = (await $.store.get('sessions')) ?? []
  const sessions = stored.filter((id) => id !== queue.sessionId)
  sessions.push(queue.sessionId)

  const dropped = sessions.splice(0, sessions.length - KEPT_SESSIONS)

  for (const id of dropped) {
    await $.store.delete('rows:' + id)
  }

  await $.store.set('sessions', sessions)
}

async function persist($, queue, bubbles) {
  await save($, queue)

  if (bubbles.isTracked) {
    await saveRows($, queue, bubbles)
  }
}

async function load($, queue, bubbles, sessionId) {
  if (sessionId === queue.sessionId) {
    return
  }

  queue.sessionId = sessionId

  const saved = (await $.store.get('queue:' + sessionId)) ?? { items: [] }

  queue.items = saved.items

  queue.pausedBecause = saved.pausedBecause

  // Rows are only kept for a session followed from its first prompt, which is decided when a prompt next enters.
  const rows = await $.store.get('rows:' + sessionId)

  bubbles.known = new Set(rows?.known)

  bubbles.hidden = new Set(rows?.hidden)

  bubbles.isTracked = undefined

  if (rows !== undefined) {
    bubbles.isTracked = true
  }

  redraw($)
}

// Messages that were still with the engine when the queue was saved, each with its bubble's row: after a reload of this module the
// engine still has them, so the queue waits for them to come back; in a new process the engine's copies are gone, so the queue
// sends them itself.
function restoreWaiting(queue, bubbles, isSameProcess) {
  queue.items.forEach((item, index) => {
    if (item.row === undefined) {
      return
    }

    const id = item.row || 'saved-' + index

    delete item.row

    if (!isSameProcess) {
      return
    }

    item.bubble = {
      id,
      text: item.text,
      entry: item,
      isQueued: queue.held.includes(item.text),
      isRemoved: false,
    }

    bubbles.sentMidTurn.set(id, item.bubble)
  })
}

// A newly sent message joins the end of the queue, or takes the place of the message the user took out to edit.
function enqueue(queue, item) {
  const index = queue.editedIndex ?? queue.items.length

  queue.editedIndex = undefined

  queue.items.splice(index, 0, item)
}

// A message whose bubble was not listed when drawn takes the place in the queue that its sending order gives it.
function insertEntry(queue, bubbles, bubble, item) {
  const order = [...bubbles.sentMidTurn.values()]

  const position = order.indexOf(bubble)

  const index = queue.items.findIndex((other) => other.bubble !== undefined && order.indexOf(other.bubble) > position)

  if (position === -1 || index === -1) {
    queue.items.push(item)
  } else {
    queue.items.splice(index, 0, item)
  }
}

// A message still with the engine cannot be taken back from it, so removing one marks its bubble as not to be queued when it returns.
async function remove($, queue, item) {
  if (queue.editedIndex !== undefined && queue.items.indexOf(item) < queue.editedIndex) {
    queue.editedIndex -= 1
  }

  queue.items = queue.items.filter((other) => other !== item)

  if (item.bubble !== undefined) {
    item.bubble.isRemoved = true
  }

  redraw($)

  await save($, queue)
}

async function move($, queue, item, offset) {
  const index = queue.items.indexOf(item)

  const target = index + offset

  if (
    index === -1 ||
    target < 0 ||
    target >= queue.items.length ||
    queue.delivering !== undefined
  ) {
    return
  }

  const items = queue.items.filter((other) => other !== item)
  items.splice(target, 0, item)

  queue.items = items

  redraw($)

  await save($, queue)

  deliver($, queue)
}

async function pause($, queue, because) {
  queue.pausedBecause = because

  redraw($)

  await save($, queue)
}

async function hold($, queue, held) {
  queue.held = held

  await $.state.set(HELD, held)
}

function startsWithMessage(text, message) {
  return message !== '' && (text === message || text.startsWith(message + '\n'))
}

function afterMessage(text, message) {
  return text.slice(message.length).replace(/^\n+/, '')
}

// The messages a prompt carries after the ones the engine held: those the engine never offered, told apart by their bubbles.
// Undefined when the prompt is not messages the engine sent back.
function lateMessages(text, held, waiting) {
  let rest = text.replace(/^\n+/, '')

  for (const message of held) {
    if (!startsWithMessage(rest, message)) {
      return undefined
    }

    rest = afterMessage(rest, message)
  }

  // An old row drawn mid-turn can carry a message's first line or its very text, so the longest and then the newest bubble wins.
  const late = []

  let candidates = waiting

  while (true) {
    const matches = candidates.filter((bubble) => startsWithMessage(rest, bubble.text))

    if (matches.length === 0) {
      break
    }

    let bubble = matches[0]

    for (const other of matches) {
      if (other.text.length >= bubble.text.length) {
        bubble = other
      }
    }

    late.push(bubble)

    rest = afterMessage(rest, bubble.text)

    candidates = candidates.filter((other) => other !== bubble)
  }

  if (held.length === 0 && late.length === 0) {
    return undefined
  }

  if (rest !== '') {
    late.push({ text: rest })
  }

  return late
}

// Bubbles of messages that are still with the engine and have not been offered, oldest first.
function waitingBubbles(bubbles) {
  const waiting = []

  for (const [id, bubble] of bubbles.sentMidTurn) {
    if (!bubble.isQueued && !bubbles.promptRows.has(id)) {
      waiting.push(bubble)
    }
  }

  return waiting
}

// The texts of the user messages the transcript holds, read once per turn.
function priorTexts($, bubbles) {
  bubbles.priorTexts ??= $.session.messages().then((messages) => {
    const texts = new Set()

    for (const message of messages) {
      if (message.role === 'user') {
        texts.add(message.text)
      }
    }

    return texts
  })

  return bubbles.priorTexts
}

function imagesNote(item) {
  return IMAGES_ELSEWHERE_NOTE + '\n' + item.images.join('\n')
}

function withImagesNote(context, item) {
  if (item.images === undefined) {
    return context
  }

  return [...(context ?? []), imagesNote(item)]
}

// Hands a message to the running turn, which reads it at its next step.
async function interject($, message) {
  let text = 'The user sent a new message while you were working:\n' + message.text
  text += '\n\nAddress this message as you continue this turn.'

  if (message.images !== undefined) {
    text += '\n\n' + imagesNote(message)
  }

  await $.session.append({ message: { type: 'user', content: [{ type: 'text', text }] } })

  $.ui.log('steered into the running turn: ' + message.text)
}

// A message is done with once its prompt entered the session; one that did not enter stays queued and pauses the queue.
async function settle($, queue, item, refusal) {
  queue.delivering = undefined

  if (refusal === undefined) {
    await remove($, queue, item)
    return
  }

  $.ui.log('queued message could not be sent: ' + refusal)

  await pause($, queue, 'a message could not be sent')
}

// A message still with the engine comes back with the engine's own prompt, so the queue waits for that instead of sending it.
function deliver($, queue) {
  if (
    queue.items.length === 0 ||
    queue.runningTurn !== undefined ||
    queue.pausedBecause !== undefined ||
    queue.delivering !== undefined
  ) {
    return
  }

  if (queue.held.length > 0 || queue.items[0].bubble !== undefined) {
    return
  }

  const item = queue.items[0]

  queue.delivering = item

  $.prompt.submit({ text: item.text, asUser: true }).then(
    (result) => settle($, queue, item, result.drop),
    (error) => settle($, queue, item, String(error)),
  )
}

async function resume($, queue) {
  queue.pausedBecause = undefined

  redraw($)

  await save($, queue)

  deliver($, queue)
}

async function steer($, queue, item) {
  if (!queue.items.includes(item) || queue.delivering !== undefined) {
    return
  }

  if (queue.runningTurn === undefined) {
    const others = queue.items.filter((other) => other !== item)
    queue.items = [item, ...others]

    await resume($, queue)
    return
  }

  await remove($, queue, item)

  queue.steered.push(item)

  await interject($, item)
}

async function edit($, queue, item) {
  if (!queue.items.includes(item) || queue.delivering !== undefined) {
    return
  }

  const filled = await $.prompt.fill({ text: item.text })

  if (!filled.isFilled) {
    return
  }

  const index = queue.items.indexOf(item)

  await remove($, queue, item)

  queue.editedIndex = index
}

async function discard($, queue, item) {
  if (queue.delivering !== undefined) {
    return
  }

  await remove($, queue, item)

  deliver($, queue)
}

export function register(on) {
  // The desktop app shows a dropped prompt as a warning card, so there the engine holds a queued message instead (held) and sends
  // everything it has waiting back as one prompt when the turn ends. A queued message still with the engine keeps its bubble's
  // record (item.bubble) until then. A picture sent on its own never reaches the queue: the app does not draw it through a mod, and
  // it comes back as an attachment of the engine's prompt. imagesFor is the queued messages waiting to learn where a returned
  // group's images are. editedIndex is the place of the message the user took out to edit, kept for what they send next in the
  // same turn. steered is the messages steered into the running turn that no later request of that turn has carried yet.
  const queue = {
    sessionId: undefined,
    items: [],
    pausedBecause: undefined,
    delivering: undefined,
    runningTurn: undefined,
    held: [],
    isHolding: false,
    imagesFor: undefined,
    editedIndex: undefined,
    steered: [],
  }

  // The desktop app draws a message as a bubble the moment it is sent. A bubble first drawn while a turn runs is a message waiting
  // on that turn (sentMidTurn, emptied when the engine hands them back): queued at once and drawn empty, unless it could be an old
  // row scrolling into view. In a session followed from its first prompt (isTracked) the rows the session has stored are known by
  // id (known); otherwise a row counts as old when the transcript holds its text. A bubble first drawn while idle is the prompt
  // being typed
  // (typed). The engine offers only its oldest waiting message during the turn and sends them all back under the last bubble sent,
  // which then shows the message that entered the turn (sentBack); the other bubbles stay out of the chat (hidden).
  const bubbles = {
    drawn: new Set(),
    promptRows: new Set(),
    known: new Set(),
    isTracked: undefined,
    sentMidTurn: new Map(),
    hidden: new Set(),
    priorTexts: undefined,
    typed: undefined,
    sentBack: new Map(),
  }

  on('session.start', async ($, e, next) => {
    const held = (await $.state.get(HELD)).value

    queue.held = held ?? []

    await $.state.set(HELD, queue.held)

    await load($, queue, bubbles, await $.session.id())

    restoreWaiting(queue, bubbles, held !== undefined)

    deliver($, queue)

    return next(e)
  })

  on('classic.SessionStart', { source: ['clear', 'resume', 'fork'] }, async ($, e, next) => {
    await load($, queue, bubbles, e.session_id)

    deliver($, queue)

    return next(e)
  })

  on('prompt.submit', async ($, e, next) => {
    if (!USER_ORIGINS.includes(e.origin.kind)) {
      const item = queue.delivering

      if (
        e.origin.kind !== 'plugin' ||
        e.origin.name !== 'queue' ||
        item?.images === undefined
      ) {
        return next(e)
      }

      return next({ ...e, context: withImagesNote(e.context, item) })
    }

    if (e.turnId === undefined) {
      let late

      if (e.text !== bubbles.typed) {
        late = lateMessages(e.text, queue.held, waitingBubbles(bubbles))
      }

      const returned = queue.held.length + (late?.length ?? 0)

      if (queue.held.length > 0) {
        await hold($, queue, [])
      }

      if (late === undefined) {
        // The engine did not send the messages it held back, so the queue sends them itself.
        for (const item of queue.items) {
          if (item.bubble?.isQueued) {
            delete item.bubble
          }
        }

        return next(e)
      }

      for (const message of late) {
        message.isQueued = true

        if (message.isRemoved || message.entry !== undefined) {
          continue
        }

        message.entry = { text: message.text, bubble: message }

        insertEntry(queue, bubbles, message, message.entry)
      }

      // The engine hands back everything it has waiting at once, so the queue now sends the whole group itself, and a bubble the
      // engine did not hand back was an old row.
      queue.items = queue.items.filter((item) => item.bubble === undefined || item.bubble.isQueued)

      const batch = []

      for (const item of queue.items) {
        if (item.bubble === undefined) {
          continue
        }

        delete item.bubble

        batch.push(item)
      }

      for (const [id, bubble] of bubbles.sentMidTurn) {
        if (bubble.isQueued) {
          bubbles.hidden.add(id)
        }
      }

      bubbles.sentMidTurn.clear()

      redraw($)

      if (queue.items.length === 0) {
        return { drop: 'removed from the queue' }
      }

      if (queue.pausedBecause !== undefined) {
        await save($, queue)

        if (e.attachments !== undefined) {
          return { drop: 'queue paused because ' + queue.pausedBecause + ', and its pictures were not kept, so attach them again' }
        }

        return { drop: 'queue paused because ' + queue.pausedBecause }
      }

      const item = queue.items[0]

      const sentBack = { ...e, text: item.text }

      let context = withImagesNote(e.context, item)

      if (e.attachments !== undefined && (returned > 1 || !batch.includes(item))) {
        queue.imagesFor = batch.filter((member) => member !== item)
        context = [...(context ?? []), IMAGES_ATTACHED_NOTE]
      }

      if (context !== undefined) {
        sentBack.context = context
      }

      queue.delivering = item

      const result = await next(sentBack)

      await settle($, queue, item, result.drop)
      return result
    }

    const isDesktop = (await $.session.surfaces()).includes('desktop')

    // The engine offers its oldest waiting message.
    const bubble = waitingBubbles(bubbles).find((waiting) => waiting.text === e.text)

    if (bubble !== undefined) {
      bubble.isQueued = true
    }

    // A message with attachments goes back to the engine with its attachments only on the desktop, where the engine holds it.
    if (
      e.wait ||
      e.text.startsWith('/') ||
      (e.attachments !== undefined && !isDesktop)
    ) {
      if (bubble?.entry !== undefined) {
        await remove($, queue, bubble.entry)
      }

      return next(e)
    }

    // A picture sent on its own is held with the rest and comes back as an attachment of the engine's prompt.
    let item = bubble?.entry

    if (item === undefined && !bubble?.isRemoved && e.text !== '') {
      item = { text: e.text }

      if (bubble === undefined) {
        enqueue(queue, item)
      } else {
        insertEntry(queue, bubbles, bubble, item)
      }
    }

    redraw($)

    await save($, queue)

    if (!isDesktop) {
      return { drop: 'queued, ' + queue.items.length + ' waiting' }
    }

    if (item !== undefined && item.bubble === undefined) {
      item.bubble = bubble ?? {
        id: 'offered-' + bubbles.sentMidTurn.size,
        text: e.text,
        isQueued: true,
        isRemoved: false,
      }

      item.bubble.entry = item

      bubbles.sentMidTurn.set(item.bubble.id, item.bubble)
    }

    if (e.text !== '') {
      await hold($, queue, [...queue.held, e.text])
    }

    queue.isHolding = true

    try {
      return await next(e)
    } finally {
      queue.isHolding = false
    }
  })

  on('classic.UserPromptSubmit', async ($, e, next) => {
    if (queue.isHolding) {
      return { preventContinuation: true }
    }

    return next(e)
  })

  on('turn.start', async ($, e, next) => {
    queue.runningTurn = e.turnId

    queue.editedIndex = undefined

    queue.imagesFor = undefined

    bubbles.typed = undefined

    bubbles.priorTexts = undefined

    // A pause set when nothing was queued only waits for messages the engine may still send back.
    if (queue.items.length === 0) {
      queue.pausedBecause = undefined
    }

    return next(e)
  })

  on('session.append', async ($, e, next) => {
    // Every row the session stores for the user's side is an old row from then on; tool results are never drawn as messages.
    const isUserRow =
      e.agentId === undefined &&
      e.message.type === 'user' &&
      e.door !== 'tool-result' &&
      e.door !== 'tool-message'

    if (isUserRow) {
      bubbles.known.add(e.uuid)
    }

    if (isUserRow && e.door === 'prompt') {
      bubbles.drawn.add(e.uuid)

      bubbles.promptRows.add(e.uuid)

      const wasWaiting = bubbles.hidden.delete(e.uuid) || bubbles.sentMidTurn.has(e.uuid)

      const text = e.message.content.find((block) => block.type === 'text')?.text

      if (wasWaiting && text !== undefined) {
        bubbles.sentBack.set(e.uuid, text)
      }

      if (wasWaiting) {
        redraw($)
      }

      if (bubbles.isTracked === undefined) {
        const messages = await $.session.messages()
        bubbles.isTracked = messages.length === 0
      }

      if (bubbles.isTracked) {
        await saveRows($, queue, bubbles)
      }
    }

    // The engine records where it saved a prompt's images in a row right after the prompt.
    if (e.door === 'note' && queue.imagesFor !== undefined) {
      const images = []

      for (const block of e.message.content) {
        if (block.type === 'text' && block.text.startsWith(IMAGE_SOURCE)) {
          images.push(block.text)
        }
      }

      if (images.length > 0) {
        for (const item of queue.imagesFor) {
          item.images = [...(item.images ?? []), ...images]
        }

        await save($, queue)
      }
    }

    return next(e)
  })

  on('ui.render', { component: 'UserMessage', surface: 'desktop' }, async ($, e, next) => {
    if (!bubbles.drawn.has(e.requestId)) {
      bubbles.drawn.add(e.requestId)

      const isOld =
        e.props.task !== undefined ||
        e.props.from !== undefined ||
        (bubbles.isTracked === true && bubbles.known.has(e.requestId))

      if (queue.runningTurn === undefined) {
        bubbles.typed = e.props.text
      } else if (!isOld) {
        const bubble = {
          id: e.requestId,
          text: e.props.text,
          entry: undefined,
          isQueued: false,
          isRemoved: false,
        }

        bubbles.sentMidTurn.set(e.requestId, bubble)

        let isNew = bubble.text !== ''

        if (isNew && bubbles.isTracked !== true) {
          const texts = await priorTexts($, bubbles)
          isNew = !texts.has(bubble.text)
        }

        bubbles.known.add(e.requestId)

        if (
          isNew &&
          bubble.entry === undefined &&
          !bubble.isQueued &&
          !bubble.isRemoved
        ) {
          bubble.entry = { text: bubble.text, bubble }

          enqueue(queue, bubble.entry)

          // Writes are kept out of a drawing, so the queue is saved just after it.
          $.clock.after(0, () => persist($, queue, bubbles))
        }

        redraw($)
      }
    }

    if (bubbles.sentBack.has(e.requestId)) {
      const props = { ...e.props, text: bubbles.sentBack.get(e.requestId) }
      return next({ ...e, props })
    }

    const bubble = bubbles.sentMidTurn.get(e.requestId)
    const isWaiting =
      bubble !== undefined &&
      !bubbles.promptRows.has(e.requestId) &&
      (bubble.entry !== undefined || bubble.isQueued || bubble.isRemoved)

    if (!isWaiting && !bubbles.hidden.has(e.requestId)) {
      return next(e)
    }

    const { Box } = $.ui.resolve(e)
    return Box({ children: [] })
  })

  on('turn.step', async function* ($, e, next) {
    if (e.agentId === undefined) {
      queue.steered = []
    }

    return yield* next(e)
  })

  on('turn.complete', async ($, e, next) => {
    if (e.agentId !== undefined) {
      return next(e)
    }

    queue.runningTurn = undefined

    if (queue.steered.length > 0) {
      queue.items = [...queue.steered, ...queue.items]

      queue.steered = []

      await save($, queue)
    }

    if (e.isAborted) {
      await pause($, queue, 'you interrupted')
    }

    // A turn that died on an API error, such as a usage limit, would take every queued message down the same way.
    if (e.reason === 'error') {
      await pause($, queue, 'the last turn failed')
    }

    const result = await next(e)

    deliver($, queue)
    return result
  })

  on('ui.render', { component: 'AbovePrompt' }, async ($, e, next) => {
    if (queue.items.length === 0 || e.props.hasSurvey) {
      return next(e)
    }

    const { Box, Text, Button } = $.ui.resolve(e)

    const children = []

    if (queue.pausedBecause !== undefined) {
      children.push(
        Box({
          flexDirection: 'row',
          columnGap: 2,
          children: [
            Text({ children: ['Queue paused because ' + queue.pausedBecause] }),
            Button({
              key: 'resume',
              label: 'Resume',
              hotkey: 'r',
              plain: true,
              onPress: () => resume($, queue),
            }),
          ],
        }),
      )
    }

    // Each message takes two lines: its text, and under it the buttons, so more of the text fits. A longer list scrolls.
    queue.items.forEach((item, index) => {
      let hotkeys = { steer: {}, edit: {}, delete: {} }

      if (index === 0) {
        hotkeys = { steer: { hotkey: 's' }, edit: { hotkey: 'e' }, delete: { hotkey: 'd' } }
      }

      const buttons = []

      if (index > 0) {
        buttons.push(
          Button({
            key: 'up-' + index,
            label: '↑',
            plain: true,
            dimColor: true,
            onPress: () => move($, queue, item, -1),
          }),
        )
      }

      if (index < queue.items.length - 1) {
        buttons.push(
          Button({
            key: 'down-' + index,
            label: '↓',
            plain: true,
            dimColor: true,
            onPress: () => move($, queue, item, 1),
          }),
        )
      }

      buttons.push(
        Button({
          ...hotkeys.steer,
          key: 'steer-' + index,
          label: 'Steer',
          plain: true,
          dimColor: true,
          onPress: () => steer($, queue, item),
        }),
        Button({
          ...hotkeys.edit,
          key: 'edit-' + index,
          label: 'Edit',
          plain: true,
          dimColor: true,
          onPress: () => edit($, queue, item),
        }),
        Button({
          ...hotkeys.delete,
          key: 'delete-' + index,
          label: 'Delete',
          plain: true,
          dimColor: true,
          onPress: () => discard($, queue, item),
        }),
      )

      children.push(
        Box({
          key: 'row-' + index,
          flexDirection: 'column',
          children: [
            Box({
              flexDirection: 'row',
              columnGap: 1,
              children: [
                Text({ dimColor: true, children: [String(index + 1) + '.'] }),
                Text({ wrap: 'truncate-end', children: [item.text.replace(/\s+/g, ' ')] }),
              ],
            }),
            Box({ flexDirection: 'row', columnGap: 2, paddingLeft: 3, children: buttons }),
          ],
        }),
      )
    })

    return Box({ flexDirection: 'column', paddingRight: 4, children })
  })
}
