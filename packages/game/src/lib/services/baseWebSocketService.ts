import type { WebSocketConnect, WebSocketEvents, WebSocketMessage } from '@chat-game/types'
import type { GameAddon, WebSocketService } from '../types'
import { createId } from '@paralleldrive/cuid2'
import { TreeObject } from '../objects/treeObject'

export class BaseWebSocketService implements WebSocketService {
  #socket!: WebSocket
  roomId: string | null = null

  constructor(readonly addon: GameAddon, readonly websocketUrl: string) {}

  connect(roomId: string) {
    this.#socket = new WebSocket(this.websocketUrl)

    this.#socket.onopen = () => {
      const connectMessage: WebSocketConnect = {
        type: 'CONNECT',
        data: {
          client: this.addon.client,
          id: roomId,
        },
      }
      this.#socket.send(JSON.stringify({ id: createId(), ...connectMessage }))

      this.roomId = roomId
    }

    this.#socket.addEventListener('message', (event) => {
      const message = this.#parse(event.data.toString())
      if (!message) {
        return
      }

      void this.#handleMessage(message)
    })
  }

  send(event: WebSocketEvents) {
    const preparedMessage = JSON.stringify({ ...event, id: createId() })
    this.#socket.send(preparedMessage)
  }

  async #handleMessage(message: WebSocketMessage) {
    if (message.type === 'MESSAGE') {
      const { text, player, character } = message.data
      this.addon.handleMessage({ text, playerId: player.id, character })
    }
    if (message.type === 'LEVEL_UP') {
      const { text, playerId } = message.data
      this.addon.handleMessage({ text, playerId })
    }
    if (message.type === 'NEW_TREE') {
      const { x } = message.data
      this.addon.app.stage.addChild(new TreeObject({ addon: this.addon, x, y: 0 }))
    }
  }

  #parse(message: string): WebSocketMessage | undefined {
    const parsed = JSON.parse(message)
    if (parsed) {
      return parsed as WebSocketMessage
    }

    return undefined
  }
}
