import { initData } from '@telegram-apps/sdk-vue'
import { useFetch } from '@vueuse/core'

const { data, execute: refreshProfile } = useFetch(`https://chatgame.space/api/telegram/`, {
  async beforeFetch() {
    const user = initData.user()
    if (user) {
      return {
        url: `https://chatgame.space/api/telegram/${user.id}?username=${user.username}`,
      }
    }
  },
}).get().json()

export function useTelegramProfile() {
  return { profile: data, refreshProfile }
}
