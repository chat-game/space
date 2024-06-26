import type { Inventory, Player } from '@hmbanan666/chat-game-api'
import type { GameService } from '../interface'

export interface GameServerService extends GameService {
  getPlayer: (id: string) => Promise<Player | null>
  getInventory: (id: string) => Promise<Inventory | null>
}
