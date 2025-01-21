import type { WebSocketConnectAddon, WebSocketMessage } from '@chat-game/types'
import type { GameAddon, WebSocketService } from '../types'
import { createId } from '@paralleldrive/cuid2'

export class BaseWebSocketService implements WebSocketService {
  socket!: WebSocket

  constructor(readonly addon: GameAddon, readonly websocketUrl: string) {
    this.socket = new WebSocket(this.websocketUrl)

    this.socket.onopen = () => {
      const prepearedMessage: WebSocketConnectAddon = {
        type: 'CONNECT_ADDON',
        data: {
          token: this.addon.token,
        },
      }
      this.socket.send(JSON.stringify({ ...prepearedMessage, id: createId() }))
    }

    this.socket.addEventListener('message', (event) => {
      const message = this.#parse(event.data.toString())
      if (!message) {
        return
      }

      void this.#handleMessage(message)
    })
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
  }

  #parse(message: string): WebSocketMessage | undefined {
    const parsed = JSON.parse(message)
    if (parsed) {
      return parsed as WebSocketMessage
    }

    return undefined
  }
}
