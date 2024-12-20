import type { Player } from '@chat-game/types'
import type { ServerService } from '../types'

export class BaseServerService implements ServerService {
  async getPlayer(id: string): Promise<Player | null> {
    try {
      const res = await fetch(`/api/game/player/${id}`)
      const player = (await res.json()) as Player
      if (!player?.id) {
        return null
      }

      return player
    } catch (err) {
      console.error(err)
      return null
    }
  }
}
