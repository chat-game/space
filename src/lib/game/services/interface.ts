import type {
  Game,
  GameObject,
  GameObjectFlag,
  GameSceneType,
  IGamePoll,
  IGameQuest,
  ITradeOffer,
  WebSocketMessage,
} from '$lib/game/types'
import type { GameChunk } from '$lib/game/services/chunk/interface'

export interface GameService {
  game: Game
  update: () => void
}

export interface GameWagonService extends GameService {
  wagon: Wagon
  randomOutFlag: GameObjectFlag
  randomNearFlag: GameObjectFlag
  initWagon: (point: { x: number, y: number }) => void
}

export interface Wagon extends GameObject {
  fuel: number
  visibilityArea: {
    startX: number
    endX: number
    startY: number
    endY: number
  }
  cargoType: 'CHEST' | undefined
}

export interface GameActionService extends GameService {
  getAmountFromChatCommand: (text: string) => number | null
}

export interface GameRouteService extends GameService {
  route: IGameRoute | undefined
  nextFlag: GameObjectFlag | undefined
  addChunk: (chunk: GameChunk) => void
}

export interface IGameRoute {
  startPoint: { x: number, y: number }
  endPoint: { x: number, y: number }
  chunks: GameChunk[]
  addGlobalFlag: (point: { x: number, y: number }) => void
  setEndPoint: (point: { x: number, y: number }) => void
  removeFlag: (id: string) => void
}

export interface GameEventService extends GameService {
  events: IGameEvent[]
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
}
