import type { GameObject, GameObjectPlayer, WebSocketConnect, WebSocketEvents, WebSocketMessage } from '@chat-game/types'
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
        if (this.addon.findObject(obj.id)) {
          continue
        }

        if (obj.type === 'PLAYER') {
          if (obj?.telegramId !== this.addon.player?.telegramId) {
            this.addon.playerService.createPlayer({ id: obj.id, telegramId: obj.telegramId, x: obj.x, character: obj.character })
          }
        } else if (obj.type === 'TREE') {
          this.addon.treeService.create({ id: obj.id, x: obj.x, zIndex: obj.zIndex, treeType: obj.treeType, size: 75, maxSize: obj.maxSize })
        } else {
          this.addon.createObject({ type: obj.type, id: obj.id, x: obj.x, zIndex: obj?.zIndex })
        }
      }

      if (type === 'PLAYER' && this.addon.player) {
        const player = objects.find((obj) => obj.type === 'PLAYER' && obj.id === id) as GameObject & GameObjectPlayer
        if (player && player?.telegramId === this.addon.player?.telegramId) {
          this.addon.player.id = id
          this.addon.player.x = player.x
          this.addon.player.initChar(player.character)
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
    }

    if (this.addon.client === 'WAGON_CLIENT') {
      if (message.type === 'NEW_PLAYER_TARGET') {
        const { id, x } = message.data
        this.addon.playerService.movePlayer({ id, x })
      }
    }

    if (message.type === 'NEW_TREE') {
      const { id, x, zIndex, treeType, maxSize } = message.data
      this.addon.treeService.create({ id, x, zIndex, treeType, size: 8, maxSize })
    }
    if (message.type === 'DESTROY_TREE') {
      const { id } = message.data
      this.addon.removeObject(id)
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
