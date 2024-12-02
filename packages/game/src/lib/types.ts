import type {
  CharacterEditionWithCharacter,
  Inventory,
  Player,
  WebSocketEvents,
} from '@chat-game/types'
import type { Application, Container } from 'pixi.js'

export interface GameAddon extends Container {
  id: string
  client: 'TELEGRAM_CLIENT' | 'WAGON_CLIENT'
  children: GameObject[]
  tick: number
  bottomY: number
  app: Application
  playerService: PlayerService
  treeService: TreeService
  serverService: ServerService
  websocketService: WebSocketService
  play: () => void
  checkIfThisFlagIsTarget: (id: string) => boolean
  findObject: (id: string) => GameObject | undefined
  removeObject: (obj: GameObject) => void
  rebuildScene: () => void
  randomOutFlag: GameObjectFlag
  randomNearFlag: GameObjectFlag
  handleMessage: ({
    playerId,
    text,
    character,
  }: {
    playerId: string
    text: string
    character?: CharacterEditionWithCharacter
  }) => Promise<{
    ok: boolean
    message: string | null
  }>
}

export interface GameObject extends Container {
  id: string
  type: GameObjectType
  state: GameObjectState
  direction: GameObjectDirection
  target: GameObject | undefined
  health: number
  speedPerSecond: number
  size: number
  isOnWagonPath: boolean
  addon: GameAddon
  script: Script | undefined
  live: () => void
  animate: () => void
  move: () => boolean
  setTarget: (obj: GameObject) => void
}

export interface GameObjectFlag extends GameObject {
  variant: 'MOVEMENT' | 'OUT_OF_SCREEN' | 'PLAYER_MOVEMENT'
}

export interface GameObjectTree extends GameObject {
  variant: 'GREEN'
}

export interface GameObjectUnit extends GameObject {
  name: string
  coins: number
  visual: {
    head: '1'
    hairstyle: 'BOLD' | 'CLASSIC' | 'COAL_LONG' | 'ORANGE_WITH_BEARD'
    top:
      | 'VIOLET_SHIRT'
      | 'BLACK_SHIRT'
      | 'GREEN_SHIRT'
      | 'BLUE_SHIRT'
      | 'DARK_SILVER_SHIRT'
  }
  dialogue: {
    messages: { id: string, text: string }[]
  }
  addMessage: (message: string) => void
  initVisual: (character: CharacterEditionWithCharacter) => Promise<void>
}

export interface GameObjectPlayer extends GameObjectUnit {
  reputation: number
  villainPoints: number
  refuellerPoints: number
  raiderPoints: number
  lastActionAt: Date
  init: (character: CharacterEditionWithCharacter) => Promise<void>
  updateLastActionAt: () => void
  addReputation: (amount: number) => void
  addVillainPoints: (amount: number) => void
  addRefuellerPoints: (amount: number) => void
  addRaiderPoints: (amount: number) => void
  updateCoins: (amount: number) => void
}

export interface ServerService {
  getPlayer: (id: string) => Promise<Player | null>
  getInventory: (id: string) => Promise<Inventory | null>
}

export interface WebSocketService {
  roomId: string | null
  connect: (roomId: string) => void
  send: (event: WebSocketEvents) => void
}

export interface PlayerService {
  activePlayers: GameObjectPlayer[]
  update: () => void
  init: (
    id: string,
    character?: CharacterEditionWithCharacter,
  ) => Promise<GameObjectPlayer>
}

export interface TreeService {
  update: () => void
  init: () => void
}

export type GameObjectState =
  | 'MOVING'
  | 'IDLE'
  | 'WAITING'
  | 'CHOPPING'
  | 'MINING'
  | 'DESTROYED'

export type GameObjectDirection = 'LEFT' | 'RIGHT'

type GameObjectType = 'PLAYER' | 'RAIDER' | 'FLAG' | 'TREE'

export interface Script {
  id: string
  tasks: Task[]
  isInterruptible: boolean
  live: () => void
}

export interface Task {
  id: string
  status: 'IDLE' | 'ACTIVE' | 'DONE'
  target?: GameObject
  live: () => void
}
