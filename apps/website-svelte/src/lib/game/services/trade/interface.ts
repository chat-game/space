import type { GameService } from '$lib/game/services/interface'
import type { GameObjectPlayer } from '$lib/game/types'

export interface GameTradeService extends GameService {
  traderIsMovingWithWagon: boolean
  handleTradeIsOver: () => void
  findActiveOfferAndTrade: (
    offerId: string,
    amount: number,
    player: GameObjectPlayer
  ) => Promise<FindActiveOfferAndTrade>
}

export type FindActiveOfferAndTrade = 'OFFER_ERROR' | 'OFFER_SUCCESS' | 'OFFER_NOT_FOUND'
