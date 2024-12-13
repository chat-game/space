import { initData } from '@telegram-apps/sdk-vue'
import { useFetch } from '@vueuse/core'

export function useTelegramProfile() {
  const user = initData.user()

  const { data } = useFetch(`https://chatgame.space/api/telegram/${user?.id}`, {
    async onFetchError(ctx) {
      if (ctx?.data?.statusCode === 404 && user?.id) {
        await fetch('https://chatgame.space/api/telegram/profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer 123`,
          },
          body: JSON.stringify({
            telegramId: user.id,
            username: user?.username,
          }),
        })
      }

      return ctx
    },
  }).get().json()

  return { profile: data }
}
