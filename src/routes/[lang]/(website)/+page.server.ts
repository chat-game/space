import type { PageServerLoad } from './$types'
import { api } from '$lib/server/api'

export const prerender = false
export const ssr = true

export const load = (async () => {
  const profileInfo = await api.profile.getInfo()
  if (profileInfo instanceof Error) {
    return {
      count: 0,
    }
  }

  return {
    count: profileInfo.count,
  }
}) satisfies PageServerLoad
