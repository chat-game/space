import type { GameService } from '$lib/game/services/interface'
import type { IGameSceneAction } from '$lib/game/types'

export interface GameActionService extends GameService {
  getAmountFromChatCommand: (text: string) => number | null
  isActionPossible: (action: IGameSceneAction) => boolean
}
