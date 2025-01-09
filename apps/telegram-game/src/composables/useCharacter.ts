import type { Character, CharacterEdition, CharacterLevel } from '@chat-game/types'
import { useApiFetch } from './useTelegramProfile'

type CharacterEditionData = CharacterEdition & {
  character: Character
  levels: CharacterLevel[]
  currentLevel: CharacterLevel | null
  nextLevel: CharacterLevel | null
  xpToNextLevel: number | null
}

const { data, execute: refreshCharacter } = useApiFetch('/character/active').get().json<CharacterEditionData>()

export function useCharacter() {
  return { character: data, refreshCharacter }
}
