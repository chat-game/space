import { MessageController } from '$lib/game/utils/messageController'
import type { Game } from '$lib/game/types'

export abstract class WebSocketManager {
  public static socket: WebSocket
  public static messagesPerSecond = 0
  public static kbitPerSecond = 0

  public static init(game: Game) {
    WebSocketManager.socket = new WebSocket('ws://localhost:4002')

    WebSocketManager.setMessagesPerSecondHandler()

    WebSocketManager.socket.addEventListener('message', (event) => {
      const message = MessageController.parse(event.data.toString())
      if (!message) {
        return
      }

      WebSocketManager.messagesPerSecond += 1
      const bytes = JSON.stringify(message).length
      WebSocketManager.kbitPerSecond += Math.round((bytes * 8) / 1024)

      game.handleMessage(message)
    })
  }

  public static setMessagesPerSecondHandler() {
    return setInterval(() => {
      // console.log(
      //   `${WebSocketManager.messagesPerSecond} msg/s, ${WebSocketManager.kbitPerSecond} kbit/s`,
      // )
      WebSocketManager.messagesPerSecond = 0
      WebSocketManager.kbitPerSecond = 0
    }, 1000)
  }
}
