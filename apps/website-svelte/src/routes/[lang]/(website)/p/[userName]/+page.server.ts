import { error } from '@sveltejs/kit'
import { api } from '$lib/server/api'

export async function load({ params }) {
  const profile = await api.profile.getByUserName(params.userName)
  if (!profile || profile instanceof Error) {
    error(404, 'Not found')
  }

  let trophies = await api.trophy.getProfileProgressList(profile.id)
  if (!trophies || trophies instanceof Error) {
    trophies = []
  }
  trophies = trophies.filter((t) => t.status === 'COMPLETED')

  return {
    pageProfile: profile,
    trophies,
  }
}
