import type { CharacterEdition, InventoryItem, InventoryItemEdition, Profile, TelegramProfile, Trophy, TrophyEdition } from '@chat-game/types'
import { initData } from '@telegram-apps/sdk-vue'
import { useFetch } from '@vueuse/core'

type TelegramProfileWithProfile = TelegramProfile & {
  profile: Profile & {
    trophyEditions: (TrophyEdition & { trophy: Trophy })[]
    characterEditions: CharacterEdition[]
    itemEditions: (InventoryItemEdition & { item: InventoryItem })[]
  }
}

const { data, execute: refreshProfile } = useFetch(`https://chatgame.space/api/telegram/`, {
  async beforeFetch() {
    const user = initData.user()
    if (user) {
      return {
        url: `https://chatgame.space/api/telegram/${user.id}?username=${user.username}`,
      }
    }
  },
}).get().json<TelegramProfileWithProfile>()

export function useTelegramProfile() {
  return { profile: data, refreshProfile }
}
