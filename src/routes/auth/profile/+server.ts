import { error, json } from '@sveltejs/kit'
import type { RequestHandler } from './$types'
import { serverConfig } from '$lib/config'

export const GET: RequestHandler = async ({ locals }) => {
  if (!locals.profile) {
    return error(401)
  }

  return json(locals.profile)
}

export const DELETE: RequestHandler = async ({ cookies }) => {
  const cookieKey = serverConfig.cookieKey
  if (!cookieKey) {
    error(500, 'Config problem')
  }

  if (cookies.get(cookieKey)) {
    cookies.delete(cookieKey, { path: '/' })
  }

  return json({
    ok: true,
  })
}
