import { error } from '@sveltejs/kit'
import type { PageServerLoad } from './$types'

export const load: PageServerLoad = async ({ params }) => {
  const res = await fetch(`https://chatgame.space/api/character/${params.id}`)
  const character = await res.json()

  if (!character) {
    error(404, 'Not found')
  }

  return {
    character,
  }
}
