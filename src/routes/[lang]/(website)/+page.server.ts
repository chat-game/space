import type { PageServerLoad } from './$types'

export const prerender = false
export const ssr = true

export const load = (async () => {
  const res = await fetch('https://chatgame.space/api/profile')
  const profile = await res.json()

  return {
    count: profile.count,
  }
}) satisfies PageServerLoad
