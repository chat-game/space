import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { api } from '$lib/server/api'

export const load = (async ({ params }) => {
  const profile = await api.profile.getByUserName(params.userName)
  if (!profile || profile instanceof Error) {
    error(404, 'Not found')
  }

  return {
    profile,
  }
}) satisfies PageServerLoad
