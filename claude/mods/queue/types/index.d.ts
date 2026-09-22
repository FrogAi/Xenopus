export type QueueHeld = string[]

declare module 'claude-code' {
  interface PluginState {
    queue: { held: QueueHeld }
  }
}
