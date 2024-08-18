import { type RequestHandler, error, json } from '@sveltejs/kit'
import { api } from '$lib/server/api'

export const GET: RequestHandler = async ({ params }) => {
  // if (!locals.profile) {
  //   return error(401)
  // }

  const playerId = params.id ?? ''

  const player = await api.player.getById(playerId)
  if (!player || player instanceof Error) {
    return error(404)
  }

  return json(player)
}
