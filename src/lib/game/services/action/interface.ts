import type { GameService } from '$lib/game/services/interface'

export interface GameActionService extends GameService {
  getAmountFromChatCommand: (text: string) => number | null
}
