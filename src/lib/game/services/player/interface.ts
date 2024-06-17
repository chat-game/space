import type { GameService } from '$lib/game/services/interface'
import type { GameObjectPlayer } from '$lib/game/types'

export interface GamePlayerService extends GameService {
  findOrCreatePlayer: (id: string) => Promise<GameObjectPlayer | undefined>
}
