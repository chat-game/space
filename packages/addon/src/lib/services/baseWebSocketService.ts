import type { WebSocketMessage } from '@chat-game/types'
import type { GameAddon, WebSocketService } from '../types'

export class BaseWebSocketService implements WebSocketService {
  socket!: WebSocket

  constructor(readonly addon: GameAddon, readonly websocketUrl: string) {
    if (window) {
      this.#init()
    }
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
    // if (message.type === 'GROUP_FORM_STARTED') {
    //   this.game.audio.playSound('MARCHING_WITH_HORNS')
    // }
    // if (message.type === 'MAIN_QUEST_STARTED') {
    //   this.game.audio.playSound('MARCHING_WITH_HORNS')
    // }
    // if (message.type === 'SCENE_CHANGED') {
    //   this.game.rebuildScene()
    // }
    // if (message.type === 'IDEA_CREATED') {
    //   this.game.audio.playSound('YEAH')
    // }
  }

  #init() {
    this.socket = new WebSocket(this.websocketUrl, [
      this.addon.id,
      this.addon.token ?? '',
    ])

    this.socket.addEventListener('message', (event) => {
      const message = this.#parse(event.data.toString())
      if (!message) {
        return
      }

      void this.#handleMessage(message)
    })
  }

  #parse(message: string): WebSocketMessage | undefined {
    const parsed = JSON.parse(message)
    if (parsed) {
      return parsed as WebSocketMessage
    }

    return undefined
  }
}
