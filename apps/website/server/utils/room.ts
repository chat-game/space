interface RoomOptions {
  id: string
  token: string
  peer: any
}

export class Room {
  id: string
  token: string
  peer: any

  constructor({ id, token, peer }: RoomOptions) {
    this.id = id
    this.token = token
    this.peer = peer
  }
}
