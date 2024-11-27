import type { CharacterEditionWithCharacter, Player, Profile, WoodlandPlayer } from './types'

export type WebSocketMessage = { id: string } & WebSocketEvents

export type WebSocketEvents =
  | WebSocketConnect
  | WebSocketEventCommand
  | WebSocketEventMessage
  | WebSocketEventLevelUp
  | WebSocketWoodlandMessage
  | WebSocketWoodlandCommand
  | WebSocketNewTree

export interface WebSocketConnect {
  type: 'CONNECT'
  data: {
    client: 'ADDON'
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

export interface WebSocketNewTree {
  type: 'NEW_TREE'
  data: {
    id: string
    x: number
  }
}
