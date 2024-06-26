import { serverConfig } from '$lib/config'

export async function load({ cookies }) {
  return {
    gameProfileJWT: cookies.get(serverConfig.cookieKey),
  }
}
