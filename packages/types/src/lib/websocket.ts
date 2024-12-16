import type { CharacterEditionWithCharacter, Player, Profile, WoodlandPlayer } from './types'

export type GameObject = {
  id: string
  x: number
  state: 'IDLE' | 'MOVING'
  health: number
  speedPerSecond: number
  size: number
  zIndex: number
} & GameObjects

export type GameObjects = GameObjectTree | GameObjectFlag | GameObjectWagon | GameObjectPlayer

export interface GameObjectTree {
  type: 'TREE'
  variant: 'GREEN' | 'VIOLET' | 'STONE' | 'TEAL' | 'TOXIC' | 'BLUE'
  treeType: '1' | '2' | '3' | '4' | '5'
  maxSize: number
}

export interface GameObjectFlag {
  type: 'FLAG'
}

export interface GameObjectWagon {
  type: 'WAGON'
}

export interface GameObjectPlayer {
  type: 'PLAYER'
  telegramId: string
}

export type WebSocketMessage = { id: string } & WebSocketEvents

export type WebSocketEvents =
  | WebSocketConnect
  | WebSocketConnectedToWagonRoom
  | WebSocketDisconnectedFromWagonRoom
  | WebSocketEventCommand
  | WebSocketEventMessage
  | WebSocketEventLevelUp
  | WebSocketWoodlandMessage
  | WebSocketWoodlandCommand
  | WebSocketNewTree
  | WebSocketDestroyTree
  | WebSocketNewWagonTarget
  | WebSocketNewPlayerTarget

export interface WebSocketConnect {
  type: 'CONNECT'
  data: {
    client: 'ADDON' | 'TELEGRAM_CLIENT' | 'WAGON_CLIENT'
    id: string
    token?: string
  }
}

export interface WebSocketEventCommand {
  type: 'COMMAND'
  data: {
    command: string
    params: string[]
    player: Player
    profile: Profile
    character: CharacterEditionWithCharacter
    text: string
  }
}

export interface WebSocketEventMessage {
  type: 'MESSAGE'
  data: {
    player: Player
    profile: Profile
    character: CharacterEditionWithCharacter
    text: string
  }
}

export interface WebSocketEventLevelUp {
  type: 'LEVEL_UP'
  data: {
    text: string
    playerId: string
  }
}

export interface WebSocketWoodlandCommand {
  type: 'WOODLAND_COMMAND'
  data: {
    command: string
    params: string[]
    player: WoodlandPlayer
    profile: Profile
    character: CharacterEditionWithCharacter
    text: string
  }
}

export interface WebSocketWoodlandMessage {
  type: 'WOODLAND_MESSAGE'
  data: {
    player: WoodlandPlayer
    profile: Profile
    character: CharacterEditionWithCharacter
    text: string
  }
}

export interface WebSocketConnectedToWagonRoom {
  type: 'CONNECTED_TO_WAGON_ROOM'
  data: {
    id: string
    type: 'WAGON' | 'PLAYER'
    objects: GameObject[]
  }
}

export interface WebSocketDisconnectedFromWagonRoom {
  type: 'DISCONNECTED_FROM_WAGON_ROOM'
  data: {
    id: string
  }
}

export interface WebSocketNewWagonTarget {
  type: 'NEW_WAGON_TARGET'
  data: {
    x: number
  }
}

export interface WebSocketNewPlayerTarget {
  type: 'NEW_PLAYER_TARGET'
  data: {
    id: string
    x: number
  }
}

export interface WebSocketNewTree {
  type: 'NEW_TREE'
  data: {
    id: string
    x: number
    zIndex: number
    treeType: '1' | '2' | '3' | '4' | '5'
    maxSize: number
  }
}

export interface WebSocketDestroyTree {
  type: 'DESTROY_TREE'
  data: {
    id: string
  }
}
