import jwt from 'jsonwebtoken'
import type { TwitchAccessTokenResponse, WebsiteProfile } from '@chat-game/types'
import { getTokenInfo } from '@twurple/auth'

export default defineEventHandler(async (event) => {
  const { public: publicEnv, jwtSecretKey } = useRuntimeConfig()
  const query = getQuery(event)

  if (!query.code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing code',
    })
  }

  const code = query.code.toString()
  const twitchResponse = await obtainTwitchAccessToken(code)
  if (!twitchResponse?.access_token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  const tokenInfo = await getTokenInfo(twitchResponse.access_token)
  if (!tokenInfo.userId || !tokenInfo.userName) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Wrong userId or userName',
    })
  }

  const repository = new DBRepository()

  const profileInDB = await repository.findOrCreateProfile({
    userId: tokenInfo.userId,
    userName: tokenInfo.userName,
  })

  const profile: WebsiteProfile = {
    id: profileInDB.id,
    twitchId: tokenInfo.userId,
    userName: tokenInfo.userName,
  }

  const token = jwt.sign({ profile }, jwtSecretKey, { expiresIn: '7d' })

  setCookie(event, publicEnv.cookieKey, token, {
    path: '/',
    httpOnly: true,
  })

  return sendRedirect(event, '/')
})

async function obtainTwitchAccessToken(code: string) {
  const { public: publicEnv, twitchSecretId } = useRuntimeConfig()

  try {
    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${publicEnv.twitchClientId}&client_secret=${twitchSecretId}&code=${code}&grant_type=authorization_code&redirect_uri=${publicEnv.signInRedirectUrl}`,
      {
        method: 'POST',
      },
    )
    return (await response.json()) as TwitchAccessTokenResponse
  } catch (err) {
    console.error('obtainTwitchAccessToken', err)
    return null
  }
}
