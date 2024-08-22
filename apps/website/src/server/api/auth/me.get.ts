import jwt from 'jsonwebtoken'
import type { WebsiteProfile } from '@chat-game/types'

export default defineEventHandler((event) => {
  const { public: publicEnv, jwtSecretKey } = useRuntimeConfig()

  const token = getCookie(event, publicEnv.cookieKey)
  if (!token) {
    throw createError({
      statusCode: 401,
      statusMessage: 'Unauthorized',
    })
  }

  try {
    const { profile } = jwt.verify(token, jwtSecretKey) as { profile: WebsiteProfile }
    return profile
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      deleteCookie(event, publicEnv.cookieKey, { path: '/' })
    }
  }

  throw createError({
    statusCode: 401,
    statusMessage: 'Unauthorized',
  })
})
