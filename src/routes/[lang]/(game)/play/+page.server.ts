import type { PageServerLoad } from './$types'
import { env } from '$env/dynamic/public'

export const load = (async ({ cookies }) => {
  const cookieKey = env.PUBLIC_COOKIE_KEY

  return {
    gameProfileJWT: cookies.get(cookieKey),
  }
}) satisfies PageServerLoad
