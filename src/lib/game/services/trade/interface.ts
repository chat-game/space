import type { GameService } from '$lib/game/services/interface'

export interface GameTradeService extends GameService {
  traderIsMovingWithWagon: boolean
  handleTradeIsOver: () => void
}
