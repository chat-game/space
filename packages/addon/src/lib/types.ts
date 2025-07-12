import type { Container } from 'pixi.js'

export interface GameAddon extends Container {
  id: string
  children: GameObject[]
  tick: number
  player: PlayerService
  play: () => void
  checkIfThisFlagIsTarget: (id: string) => boolean
  findObject: (id: string) => GameObject | undefined
  removeObject: (obj: GameObject) => void
  rebuildScene: () => void
  randomOutFlag: GameObjectFlag
  randomNearFlag: GameObjectFlag
  handleMessage: (data: {
    player: {
      id: string
      name: string
    }
    text: string
    codename?: string | null
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
  variant: 'MOVEMENT' | 'OUT_OF_SCREEN'
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
  initVisual: (codename: string | undefined | null) => Promise<void>
}

export interface GameObjectPlayer extends GameObjectUnit {
  lastActionAt: Date
  init: (name: string, codename?: string | null) => Promise<void>
  updateLastActionAt: () => void
}

export interface EventService {
  stream: EventSource
}

export interface EventStream {
  onmessage: (event: MessageEvent) => void
}

export interface PlayerService {
  activePlayers: GameObjectPlayer[]
  update: () => void
  init: (
    id: string,
    name: string,
    codename?: string | null,
  ) => Promise<GameObjectPlayer>
}

export type GameObjectState
  = | 'MOVING'
    | 'IDLE'
    | 'WAITING'
    | 'CHOPPING'
    | 'MINING'
    | 'DESTROYED'

export type GameObjectDirection = 'LEFT' | 'RIGHT'

type GameObjectType = 'PLAYER' | 'RAIDER' | 'FLAG'

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
