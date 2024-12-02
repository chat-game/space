import { BaseRoom } from './base'

interface AddonRoomOptions {
  id: string
  token: string
}

export class AddonRoom extends BaseRoom {
  peers: string[] = []

  constructor({ id, token }: AddonRoomOptions) {
    super({ id, token, type: 'ADDON' })
  }
}
