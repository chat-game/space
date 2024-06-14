import type { WebSocketMessage } from '$lib/game/types'

export class MessageController {
  public static parse(message: string): WebSocketMessage | undefined {
    const parsed = JSON.parse(message)
    if (parsed) {
      return parsed as WebSocketMessage
    }

    return undefined
  }
}
