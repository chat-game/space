import { type RequestHandler, error, json } from '@sveltejs/kit'
import { api } from '$lib/server/api'

export const GET: RequestHandler = async ({ params }) => {
  // if (!locals.profile) {
  //   return error(401)
  // }

  const inventoryId = params.id ?? ''

  const inventory = await api.inventory.getById(inventoryId)
  if (!inventory || inventory instanceof Error) {
    return error(404)
  }

  return json(inventory)
}
