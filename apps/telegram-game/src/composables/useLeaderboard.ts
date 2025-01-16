import type { LeaderboardData } from '@chat-game/types'
import { useFetch } from '@vueuse/core'

const woodlandLeaderboardId = 'jfb1d82u6brqjttrc2v8bs15'

const { data, execute: refreshLeaderboard } = useFetch(`https://chatgame.space/api/leaderboard/${woodlandLeaderboardId}/list?limit=50`, {
  async onFetchError(ctx) {
    return ctx
  },
}).get().json<LeaderboardData>()

export function useLeaderboard() {
  return { leaderboard: data, refreshLeaderboard }
}
