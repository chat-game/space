import type { CharacterEdition, InventoryItem, InventoryItemEdition, Payment, Profile, TelegramProfile, Trophy, TrophyEdition } from '@chat-game/types'
import { useFetch } from '@vueuse/core'

type TelegramProfileWithProfile = TelegramProfile & {
  profile: Profile & {
    trophyEditions: (TrophyEdition & { trophy: Trophy })[]
    characterEditions: CharacterEdition[]
    itemEditions: (InventoryItemEdition & { item: InventoryItem })[]
    payments: Payment[]
  }
}

const userId = ref<number>()
const username = ref<string | undefined>()
const url = computed(() => `https://chatgame.space/api/telegram/${userId.value}?username=${username.value}`)

const { data, execute: refreshProfile } = useFetch(url, {
  immediate: false,
}).get().json<TelegramProfileWithProfile>()

export function useTelegramProfile() {
  function updateUserData(data: { userId: number, username?: string }) {
    userId.value = data.userId
    username.value = data?.username
  }

  return { profile: data, refreshProfile, updateUserData }
}
