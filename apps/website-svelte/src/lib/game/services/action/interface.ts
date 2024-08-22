import type { GameService } from '$lib/game/services/interface'
import type { IGameActionResponse, IGameSceneAction } from '$lib/game/types'

export interface GameActionService extends GameService {
  handleCommand: ({
    command,
    playerId,
    params,
  }: {
    command: string
    playerId: string
    params: string[]
  }) => Promise<IGameActionResponse>
  handleMessage: ({
    playerId,
    text,
  }: {
    playerId: string
    text: string
  }) => Promise<IGameActionResponse>
  getAmountFromChatCommand: (text: string) => number | null
  isActionPossible: (action: IGameSceneAction) => boolean
}
