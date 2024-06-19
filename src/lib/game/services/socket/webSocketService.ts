import { MessageController } from '$lib/game/utils/messageController'
import type { Game, GameObject, WebSocketMessage } from '$lib/game/types'
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

    if (browser) {
      this.#init()
    }
  }

  update() {}

  #handleMessage(message: WebSocketMessage): void {
    if (message.object) {
      this.#handleMessageObject(message.object)
    }
    if (message.event) {
      this.#handleMessageEvent(message.event)
    }
  }

  #handleMessageObject(object: Partial<GameObject>) {
    if (!object.id) {
      return
    }

    this.game.findObject(object.id)
  }

  #handleMessageEvent(event: WebSocketMessage['event']) {
    if (event === 'RAID_STARTED') {
      this.game.audio.playSound('MARCHING_WITH_HORNS')
    }
    if (event === 'GROUP_FORM_STARTED') {
      this.game.audio.playSound('MARCHING_WITH_HORNS')
    }
    if (event === 'MAIN_QUEST_STARTED') {
      this.game.audio.playSound('MARCHING_WITH_HORNS')
    }
    if (event === 'SCENE_CHANGED') {
      this.game.rebuildScene()
    }
    if (event === 'IDEA_CREATED') {
      this.game.audio.playSound('YEAH')
    }
  }

  #init() {
    this.socket = new WebSocket(env.PUBLIC_WEBSOCKET_URL ?? '')

    this.#setMessagesPerSecondHandler()

    this.socket.addEventListener('message', (event) => {
      const message = MessageController.parse(event.data.toString())
      if (!message) {
        return
      }

      this.messagesPerSecond += 1
      const bytes = JSON.stringify(message).length
      this.kbitPerSecond += Math.round((bytes * 8) / 1024)

      this.#handleMessage(message)
    })
  }

  #setMessagesPerSecondHandler() {
    return setInterval(() => {
      // console.log(
      //   `${WebSocketManager.messagesPerSecond} msg/s, ${WebSocketManager.kbitPerSecond} kbit/s`,
      // )
      this.messagesPerSecond = 0
      this.kbitPerSecond = 0
    }, 1000)
  }
}
