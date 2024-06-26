import type { Player } from '@hmbanan666/chat-game-api'
import type { GameService } from '../interface'

export interface GameServerService extends GameService {
  getPlayerData: (id: string) => Promise<Player | null>
}
