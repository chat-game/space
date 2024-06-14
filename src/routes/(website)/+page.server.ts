import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db/db.client'

export const prerender = false
export const ssr = true

export const load = (async () => {
  return {
    count: await db.profile.count(),
  }
}) satisfies PageServerLoad
