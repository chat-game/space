import type { LeaderboardData } from '@chat-game/types'
import { useFetch } from '@vueuse/core'

const christmasId = 'iq9f2634d3q3ans243dhxmj7'

const { data, execute: refreshLeaderboard } = useFetch(`https://chatgame.space/api/leaderboard/${christmasId}/list`, {
  async onFetchError(ctx) {
    return ctx
  },
}).get().json<LeaderboardData>()

export function useLeaderboard() {
  return { leaderboard: data, refreshLeaderboard }
}
