import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { api } from '$lib/server/api'

export const load: PageServerLoad = async ({ params }) => {
  const character = await api.character.getById(params.id)
  if (character instanceof Error) {
    throw character
  }

  if (!character) {
    error(404, 'Not found')
  }

  return {
    character,
  }
}
