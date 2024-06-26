import type { WebSocketMessage } from '@hmbanan666/chat-game-api'
import type { Game } from '$lib/game/types'
import type { GameWebSocketService } from '$lib/game/services/socket/interface'
import { env } from '$env/dynamic/public'
import { browser } from '$app/environment'

export class WebSocketService implements GameWebSocketService {
  socket!: WebSocket
  messagesPerSecond = 0
  kbitPerSecond = 0
  game: Game

  constructor(game: Game) {
    this.game = game

    if (browser && this.game.options.isSocketOn) {
      this.#init()
    }
  }

  update() {}

  async #handleMessage(message: WebSocketMessage) {
    if (message.type === 'COMMAND') {
      const { command, player, params } = message.data
      this.game.actionService.handleCommand({ command, playerId: player.id, params })
    }
    if (message.type === 'MESSAGE') {
      const { text, player } = message.data
      this.game.actionService.handleMessage({ text, playerId: player.id })
    }
    // if (message.type === 'RAID_STARTED') {
    //   this.game.audio.playSound('MARCHING_WITH_HORNS')
    // }
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
    this.socket = new WebSocket(env.PUBLIC_WEBSOCKET_URL ?? '', [this.game.id])

    this.#setMessagesPerSecondHandler()

    this.socket.addEventListener('open', () => {
      this.socket.send(JSON.stringify({ type: 'GAME_HANDSHAKE', id: this.game.id, profileJWT: this.game.profileJWT }))
    })

    this.socket.addEventListener('message', (event) => {
      const message = this.#parse(event.data.toString())
      if (!message) {
        return
      }

      this.messagesPerSecond += 1
      const bytes = JSON.stringify(message).length
      this.kbitPerSecond += Math.round((bytes * 8) / 1024)

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

  #setMessagesPerSecondHandler() {
    return setInterval(() => {
      // console.log(
      //   `${this.messagesPerSecond} msg/s, ${this.kbitPerSecond} kbit/s`,
      // )
      this.messagesPerSecond = 0
      this.kbitPerSecond = 0
    }, 1000)
  }
}
