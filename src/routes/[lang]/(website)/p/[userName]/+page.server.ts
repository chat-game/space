import { error } from '@sveltejs/kit'
import { api } from '$lib/server/api'

export async function load({ params }) {
  const profile = await api.profile.getByUserName(params.userName)
  if (!profile || profile instanceof Error) {
    error(404, 'Not found')
  }

  return {
    pageProfile: profile,
  }
}
