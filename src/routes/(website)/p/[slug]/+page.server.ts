import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { db } from '$lib/server/db/db.client'

export const load = (async ({ params }) => {
  const userName = params.slug

  const profile = await db.profile.findFirst({
    where: { userName },
  })
  if (!profile) {
    error(404, 'Not found')
  }

  return {
    profile,
  }
}) satisfies PageServerLoad
