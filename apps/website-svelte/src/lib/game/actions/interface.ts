import type { GameObjectPlayer, IGameActionResponse } from '$lib/game/types'

export interface GameAction {
  command: string
  commandDescription: string
  live: (
    player: GameObjectPlayer,
    params: string[],
  ) => Promise<IGameActionResponse>
}
