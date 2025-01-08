import type { Character, CharacterEdition, CharacterLevel } from '@chat-game/types'
import { retrieveLaunchParams } from '@telegram-apps/sdk-vue'
import { createFetch } from '@vueuse/core'

type CharacterEditionData = CharacterEdition & {
  character: Character
  levels: CharacterLevel[]
  nextLevel: CharacterLevel | null
  xpToNextLevel: number | null
}

const useApiFetch = createFetch({
  baseUrl: 'https://chatgame.space/api/telegram',
  options: {
    beforeFetch({ options }) {
      const { initDataRaw } = retrieveLaunchParams()

      options.headers = {
        ...options.headers,
        'Authorization': `tma ${initDataRaw}`,
        'Content-Type': 'application/json',
      }

      return { options }
    },
  },
})

const { data, execute: refreshCharacter } = useApiFetch('/character/active').get().json<CharacterEditionData>()

export function useCharacter() {
  return { character: data, refreshCharacter }
}
