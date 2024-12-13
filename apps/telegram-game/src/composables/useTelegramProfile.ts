import { initData } from '@telegram-apps/sdk-vue'
import { useFetch } from '@vueuse/core'

export function useTelegramProfile() {
  const user = initData.user()

  const { data } = useFetch(`https://chatgame.space/api/telegram/${user?.id}?username=${user?.username}`, {
    async onFetchError(ctx) {
      return ctx
    },
  }).get().json()

  return { profile: data }
}
