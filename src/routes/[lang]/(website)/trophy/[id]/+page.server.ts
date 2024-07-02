import { error } from '@sveltejs/kit'
import { api } from '$lib/server/api'

export async function load({ params }) {
  const trophy = await api.trophy.getById(params.id)
  if (!trophy || trophy instanceof Error) {
    error(404, 'Not found')
  }

  return {
    trophy,
  }
}
