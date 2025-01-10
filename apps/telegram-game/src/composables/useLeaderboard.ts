import type { LeaderboardData } from '@chat-game/types'
import { useFetch } from '@vueuse/core'

const currentEventId = '1'

const { data, execute: refreshLeaderboard } = useFetch(`https://chatgame.space/api/leaderboard/${currentEventId}/list`, {
  async onFetchError(ctx) {
    return ctx
  },
}).get().json<LeaderboardData>()

export function useLeaderboard() {
  return { leaderboard: data, refreshLeaderboard }
}
