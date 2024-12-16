import { useFetch } from '@vueuse/core'

export function useRoom() {
  const { data: hmbanan666 } = useFetch<{ service: 'HMBANAN666_TWITCH', status: 'RUNNING' | 'STOPPED' }[]>('https://chatgame.space/api/twitch/status', {
    async onFetchError(ctx) {
      return ctx
    },
  }).get().json()

  return { hmbanan666 }
}
