import { sign } from 'jsonwebtoken'
import type { WebsiteProfile } from '@chat-game/types'

export default defineEventHandler((event) => {
  const { public: publicEnv, jwtSecretKey } = useRuntimeConfig()
  const query = getQuery(event)

  if (!query.code) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Missing code',
    })
  }

  const code = query.code.toString()

  log(JSON.stringify(query), code)

  const profile: WebsiteProfile = {
    id: '123',
    twitchToken: '2134',
    twitchId: '1245',
    userName: 'tester',
  }

  const token = sign({ profile }, jwtSecretKey, { expiresIn: '48h' })

  setCookie(event, publicEnv.cookieKey, token, {
    path: '/',
    httpOnly: true,
  })

  return sendRedirect(event, '/')
})
