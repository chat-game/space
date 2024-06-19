import type {
  GameSceneType,
  IGamePoll,
  ITradeOffer, WebSocketMessage,
} from '$lib/game/types'
import type { GameService } from '$lib/game/services/interface'
import type { IGameQuest } from '$lib/game/services/quest/interface'

export interface GameEventService extends GameService {
  events: IGameEvent[]
  destroy: (event: IGameEvent) => void
  initEvent: (event: {
    title: IGameEvent['title']
    description: IGameEvent['description']
    type: IGameEvent['type']
    secondsToEnd: number
    scene?: GameSceneType
    poll?: IGameEvent['poll']
    quest?: IGameEvent['quest']
    offers?: IGameEvent['offers']
  }) => IGameEvent
}

export interface IGameEvent {
  id: string
  title: string
  description: string
  type: WebSocketMessage['event']
  status: 'STARTED' | 'STOPPED'
  endsAt: Date
  poll?: IGamePoll
  quest?: IGameQuest
  offers?: ITradeOffer[]
  scene?: GameSceneType
  checkStatus: () => IGameEvent['status']
}
