import type { CharacterEdition, CharacterLevel } from '@chat-game/types'
import { createSharedComposable } from '@vueuse/core'
import { useApiFetch } from './useTelegramProfile'

type CharacterEditionData = CharacterEdition & {
  levels: CharacterLevel[]
  nextLevel: CharacterLevel | null
  xpToNextLevel: number | null
}

export function _useCharacter() {
  const { data, execute: refreshCharacter } = useApiFetch('/character/active').get().json<CharacterEditionData>()

  return { character: data, refreshCharacter }
}

export const useCharacter = createSharedComposable(_useCharacter)
