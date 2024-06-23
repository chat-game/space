import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'
import { api } from '$lib/server/api'

export const load: PageServerLoad = async () => {
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
