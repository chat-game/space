import { db } from "$lib/server/db/db.client"
import type { PageServerLoad } from "./$types"

export const prerender = false
export const ssr = true

export const load = (async () => {
  return {
    count: await db.profile.count(),
  }
}) satisfies PageServerLoad
