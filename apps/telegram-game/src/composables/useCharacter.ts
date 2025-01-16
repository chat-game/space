import type { Character, CharacterEdition, CharacterLevel, InventoryItem } from '@chat-game/types'
import { useApiFetch } from './useTelegramProfile'

type CharacterLevelWithItem = CharacterLevel & {
  inventoryItem: InventoryItem
}

type CharacterEditionData = CharacterEdition & {
  character: Character
  levels: CharacterLevelWithItem[]
  currentLevel: CharacterLevelWithItem | null
  nextLevel: CharacterLevelWithItem | null
  xpToNextLevel: number | null
}

const { data, execute: refreshCharacter } = useApiFetch('/character/active').get().json<CharacterEditionData>()

export function useCharacter() {
  return { character: data, refreshCharacter }
}
