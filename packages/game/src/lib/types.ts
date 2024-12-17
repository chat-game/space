import type {
  CharacterEditionWithCharacter,
  Inventory,
  Player,
  WebSocketEvents,
  WebSocketMessage,
} from '@chat-game/types'
import type { UseWebSocketReturn } from '@vueuse/core'
import type { Application, Container, Sprite } from 'pixi.js'

export interface GameAddon extends Container {
  id: string
  client: 'TELEGRAM_CLIENT' | 'WAGON_CLIENT'
  children: GameObject[]
  tick: number
  bottomY: number
  wagon: GameObjectWagon | null
  player: GameObjectPlayer | null
  app: Application
  assetService: AssetService
  playerService: PlayerService
  treeService: TreeService
  serverService: ServerService
  websocketService: WebSocketService
  play: () => void
  checkIfThisFlagIsTarget: (id: string) => boolean
  findObject: (id: string) => GameObject | undefined
  createObject: (data: { type: GameObject['type'], id: string, x: number, zIndex?: number, telegramId?: string }) => void
  removeObject: (id: string) => void
  rebuildScene: () => Promise<void>
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
  isAnObstacleToWagon: boolean
  variant: 'GREEN' | 'VIOLET' | 'STONE' | 'TEAL' | 'TOXIC' | 'BLUE'
  treeType: '1' | '2' | '3' | '4' | '5'
  maxSize: number
}

export interface GameObjectWagon extends GameObject {
  setNearestTarget: () => void
  createFlagAndMove: (x: number) => void
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
  initVisual: (codename?: string) => Promise<void>
}

export interface GameObjectPlayer extends GameObjectUnit {
  telegramId: string
  reputation: number
  villainPoints: number
  refuellerPoints: number
  raiderPoints: number
  lastActionAt: Date
  initChar: (character?: CharacterEditionWithCharacter) => Promise<void>
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
  socket: UseWebSocketReturn<WebSocketMessage>
  connect: (roomId: string) => void
  send: (event: WebSocketEvents) => void
}

export interface PlayerService {
  activePlayers: GameObjectPlayer[]
  createPlayer: (data: { id: string, telegramId: string, x: number, character?: CharacterEditionWithCharacter }) => Promise<GameObjectPlayer>
  removePlayer: (id: string) => void
  movePlayer: (data: { id: string, x: number }) => void
  update: () => void
}

export interface AssetService {
  sprite: (alias: string) => Sprite
}

export interface TreeService {
  create: (data: { id: string, x: number, zIndex: number, treeType: '1' | '2' | '3' | '4' | '5', size: number, maxSize: number }) => void
  update: () => void
  getNearestObstacle: (x: number) => GameObjectTree | undefined
}

export type GameObjectState =
  | 'MOVING'
  | 'IDLE'
  | 'WAITING'
  | 'CHOPPING'
  | 'MINING'
  | 'DESTROYED'

export type GameObjectDirection = 'LEFT' | 'RIGHT'

type GameObjectType = 'PLAYER' | 'RAIDER' | 'FLAG' | 'TREE' | 'WAGON'

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
