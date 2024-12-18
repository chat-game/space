import type { CharacterWithEditions } from '@chat-game/types'
import { useFetch } from '@vueuse/core'

const { data, execute: refreshCharacters } = useFetch('https://chatgame.space/api/character').get().json<CharacterWithEditions[]>()

export function useCharacters() {
  return { characters: data, refreshCharacters }
}
