import { error } from '@sveltejs/kit'
import { api } from '$lib/server/api'

export async function load() {
  const characters = await api.character.getList()
  if (characters instanceof Error) {
    throw characters
  }

  if (!characters.length) {
    error(404, 'Not found')
  }

  return {
    characters,
  }
}
