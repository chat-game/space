import type { Character, CharacterEditionsOnProfileData } from '@chat-game/types'
import { useFetch } from '@vueuse/core'

const { data, execute: refreshCharacters } = useFetch('https://chatgame.space/api/character').get().json<Character[]>()

const { data: profileCharacters, execute: refreshProfileCharacters } = useApiFetch('/character/list').get().json<CharacterEditionsOnProfileData>()

export function useCharacters() {
  return { characters: data, refreshCharacters, profileCharacters, refreshProfileCharacters }
}
