import type { CharacterEditionWithCharacter } from './types'

export type EventMessage = { id: string } & Events

export type Events
  = | EventNewPlayerMessage

type EventNewPlayerMessage = {
  type: 'NEW_PLAYER_MESSAGE'
  data: {
    text: string
    player: {
      id: string
      name: string
    }
    character: CharacterEditionWithCharacter
  }
}
