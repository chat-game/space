import type { Peer } from 'crossws'
import type { Room } from '~~/types/room'
import { createId } from '@paralleldrive/cuid2'

interface BaseRoomOptions {
  id: string
  token: string
  type: Room['type']
}

export class BaseRoom implements Room {
  id: string
  token: string
  type: Room['type']
  server: { ws: WebSocket, peer: Peer | null }

  constructor({ id, token, type }: BaseRoomOptions) {
    this.id = id
    this.token = token
    this.type = type

    const { public: publicEnv } = useRuntimeConfig()

    this.server = {
      ws: new WebSocket(publicEnv.websocketUrl),
      peer: null,
    }

    this.server.ws.onopen = () => {
      const prepearedMessage = JSON.stringify({
        id: createId(),
        type: 'CONNECT',
        data: {
          client: 'SERVER',
          id: this.id,
          token: this.token,
        },
      })
      this.server.ws.send(prepearedMessage)
    }
  }
}
