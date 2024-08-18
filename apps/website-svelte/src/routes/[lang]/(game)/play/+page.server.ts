import { config } from '$lib/config'

export async function load({ cookies }) {
  return {
    gameProfileJWT: cookies.get(config.cookieKey),
  }
}
