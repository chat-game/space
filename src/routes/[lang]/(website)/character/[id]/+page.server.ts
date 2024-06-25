import { error } from '@sveltejs/kit'
import { api } from '$lib/server/api'

export async function load({ params }) {
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
