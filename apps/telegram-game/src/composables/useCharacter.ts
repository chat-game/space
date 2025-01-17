import type { CharacterEditionData } from '@chat-game/types'
import { useApiFetch } from './useTelegramProfile'

const { data, execute: refreshCharacter } = useApiFetch('/character/active').get().json<CharacterEditionData>()

export function useCharacter() {
  return { character: data, refreshCharacter }
}
