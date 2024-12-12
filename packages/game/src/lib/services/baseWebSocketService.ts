import type { WebSocketConnect, WebSocketEvents, WebSocketMessage } from '@chat-game/types'
import type { GameAddon, WebSocketService } from '../types'
import { createId } from '@paralleldrive/cuid2'
import { useWebSocket } from '@vueuse/core'

export class BaseWebSocketService implements WebSocketService {
  socket: WebSocketService['socket']

  constructor(readonly addon: GameAddon, readonly websocketUrl: string) {
    this.socket = useWebSocket(this.websocketUrl, {
      autoReconnect: true,
      heartbeat: {
        message: 'ping',
        interval: 10000,
        pongTimeout: 10000,
      },
      onMessage: async (_, event) => {
        if (event.data.toString() === 'pong') {
          return
        }

        const message = this.parse(event.data.toString())
        if (!message) {
          return
        }

        await this.handleMessage(message)
      },
    })
  }

  connect(roomId: string) {
    this.socket.open()

    const connectMessage: WebSocketConnect = {
      type: 'CONNECT',
      data: {
        client: this.addon.client,
        id: roomId,
        token: this.addon.player?.telegramId,
      },
    }
    this.send(connectMessage)
  }

  send(event: WebSocketEvents) {
    const preparedMessage = JSON.stringify({ ...event, id: createId() })
    this.socket.send(preparedMessage)
  }

  async handleMessage(message: WebSocketMessage) {
    if (message.type === 'CONNECTED_TO_WAGON_ROOM') {
      const { id, type, objects } = message.data

      for (const obj of objects) {
        this.addon.createObject({ type: obj.type, id: obj.id, x: obj.x, zIndex: obj?.zIndex, telegramId: obj?.telegramId })
      }

      if (type === 'PLAYER' && this.addon.player) {
        const player = objects.find((obj) => obj.type === 'PLAYER' && obj.id === id)
        if (player && player?.telegramId === this.addon.player?.telegramId) {
          this.addon.player.id = id
          this.addon.player.x = player.x
        }
      }
    }
    if (message.type === 'DISCONNECTED_FROM_WAGON_ROOM') {
      const { id } = message.data
      this.addon.playerService.removePlayer(id)
    }

    if (this.addon.client === 'TELEGRAM_CLIENT') {
      if (message.type === 'NEW_WAGON_TARGET') {
        const { x } = message.data
        this.addon.wagon?.createFlagAndMove(x)
      }
      if (message.type === 'NEW_PLAYER_TARGET') {
        const { id, x } = message.data
        if (this.addon.player?.id !== id) {
          this.addon.playerService.movePlayer({ id, x })
        }
      }
      if (message.type === 'NEW_TREE') {
        const { id, x, zIndex } = message.data
        this.addon.createObject({ type: 'TREE', id, x, zIndex })
      }
      if (message.type === 'DESTROY_TREE') {
        const { id } = message.data
        this.addon.removeObject(id)
      }
    }

    if (this.addon.client === 'WAGON_CLIENT') {
      if (message.type === 'NEW_PLAYER_TARGET') {
        const { id, x } = message.data
        this.addon.playerService.movePlayer({ id, x })
      }
      if (message.type === 'DESTROY_TREE') {
        const { id } = message.data
        this.addon.removeObject(id)
      }
    }
  }

  parse(message: string): WebSocketMessage | undefined {
    const parsed = JSON.parse(message)
    if (parsed) {
      return parsed as WebSocketMessage
    }

    return undefined
  }
}
