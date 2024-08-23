import type { Peer } from 'crossws'

interface RoomOptions {
  id: string
  token: string
  peer: Peer<unknown>
}

export class Room {
  id: string
  token: string
  peer: Peer<unknown>

  constructor({ id, token, peer }: RoomOptions) {
    this.id = id
    this.token = token
    this.peer = peer
  }
}
