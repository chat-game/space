import { BaseRoom } from './base'

interface WagonRoomOptions {
  id: string
  token: string
}

export class WagonRoom extends BaseRoom {
  constructor({ id, token }: WagonRoomOptions) {
    super({ id, token, type: 'WAGON' })
  }
}
