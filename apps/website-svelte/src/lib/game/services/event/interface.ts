import type { GameSceneType, IGamePoll, ITradeOffer } from '$lib/game/types'
import type { GameService } from '$lib/game/services/interface'
import type { IGameQuest } from '$lib/game/services/quest/interface'
import type { GameAction } from '$lib/game/actions/interface'

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
  findActionByCommandInPoll: (command: string) => GameAction | undefined
}

export interface IGameEvent {
  id: string
  title: string
  description: string
  type:
    | 'RAID_STARTED'
    | 'SCENE_CHANGING_STARTED'
    | 'GROUP_FORM_STARTED'
    | 'IDEA_CREATED'
    | 'MAIN_QUEST_STARTED'
    | 'SIDE_QUEST_STARTED'
    | 'TRADE_STARTED'
    | 'VOTING_FOR_NEW_MAIN_QUEST_STARTED'
  status: 'STARTED' | 'STOPPED'
  endsAt: Date
  poll?: IGamePoll
  quest?: IGameQuest
  offers?: ITradeOffer[]
  scene?: GameSceneType
  checkStatus: () => IGameEvent['status']
}
