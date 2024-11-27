import { createId } from '@paralleldrive/cuid2'

interface RoomOptions {
  id: string
  token: string
  type: 'ADDON'
}

export class Room {
  id: string
  token: string
  type: 'ADDON'
  server: WebSocket

  constructor({ id, token, type }: RoomOptions) {
    this.id = id
    this.token = token
    this.type = type

    const { public: publicEnv } = useRuntimeConfig()

    this.server = new WebSocket(publicEnv.websocketUrl)

    this.server.onopen = () => {
      const prepearedMessage = JSON.stringify({
        id: createId(),
        type: 'CONNECT',
        data: {
          client: 'SERVER',
          id: this.id,
          token: this.token,
        },
      })
      this.server.send(prepearedMessage)
    }

    setInterval(() => {
      this.server.send(JSON.stringify({ id: 1, type: 'TEST', data: { id: this.id } }))
    }, 10000)
  }
}
