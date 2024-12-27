import type { CharacterEdition, InventoryItem, InventoryItemEdition, Payment, Profile, TelegramProfile, Trophy, TrophyEdition } from '@chat-game/types'
import { retrieveLaunchParams } from '@telegram-apps/sdk-vue'
import { createFetch } from '@vueuse/core'

type TelegramProfileWithProfile = TelegramProfile & {
  profile: Profile & {
    trophyEditions: (TrophyEdition & { trophy: Trophy })[]
    characterEditions: CharacterEdition[]
    itemEditions: (InventoryItemEdition & { item: InventoryItem })[]
    payments: Payment[]
  }
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

const { data, execute: refreshProfile } = useApiFetch('/', { immediate: false }).get().json<TelegramProfileWithProfile>()

export function useTelegramProfile() {
  return { profile: data, refreshProfile, useApiFetch }
}
