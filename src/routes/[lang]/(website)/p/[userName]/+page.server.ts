import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load = (async ({ params }) => {
  const res = await fetch(`https://chatgame.space/api/profile/userName/${params.userName}`)
  const profile = await res.json()

  if (!profile) {
    error(404, 'Not found')
  }

  return {
    profile,
  }
}) satisfies PageServerLoad
