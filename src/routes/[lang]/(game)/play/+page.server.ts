import { env } from '$env/dynamic/public'

export async function load({ cookies }) {
  const cookieKey = env.PUBLIC_COOKIE_KEY ?? ''

  return {
    gameProfileJWT: cookies.get(cookieKey),
  }
}
