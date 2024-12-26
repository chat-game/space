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
  peers: string[] = []

  constructor({ id, token, type }: BaseRoomOptions) {
    this.id = id
    this.token = token
    this.type = type

    const { public: publicEnv } = useRuntimeConfig()

    this.server = {
      ws: new WebSocket(publicEnv.websocketUrl),
      peer: null,
    }

    this.connectServer()
  }

  initServerSocket() {
    const { public: publicEnv } = useRuntimeConfig()

    this.server = {
      ws: new WebSocket(publicEnv.websocketUrl),
      peer: null,
    }
  }

  connectServer() {
    if (this.server.ws) {
      this.server.ws.removeEventListener('open', this.onopen.bind(this))
      this.server.ws.removeEventListener('close', this.onclose.bind(this))
    }

    this.server.ws.addEventListener('open', this.onopen.bind(this))
    this.server.ws.addEventListener('close', this.onclose.bind(this))
  }

  onopen() {
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

  onclose() {
    this.initServerSocket()
    this.connectServer()
  }
}
