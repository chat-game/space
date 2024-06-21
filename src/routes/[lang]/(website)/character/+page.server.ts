import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async () => {
  const res = await fetch('https://chatgame.space/api/character')
  const characters = await res.json()

  if (!characters.length) {
    error(404, 'Not found')
  }

  return {
    characters,
  }
}
