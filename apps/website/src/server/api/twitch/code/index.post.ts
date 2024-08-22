import { createId } from '@paralleldrive/cuid2'
import type { EventHandlerRequest } from 'h3'
import type { TokenCreateResponse, TwitchAccessTokenResponse, TwitchToken } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<TokenCreateResponse>>(
  async (event) => {
    const { public: publicEnv } = useRuntimeConfig()
    const body = await readBody(event)

    if (!body.code || !body.profileId) {
      throw createError({
        statusCode: 400,
        message: 'You must provide code and profileId',
      })
    }

    const profile = await db.profile.findFirst({
      where: { id: body.profileId },
    })
    if (!profile) {
      throw createError({
        statusCode: 400,
        message: 'Not correct profile',
      })
    }

    const res = await obtainTwitchAccessToken(body.code, publicEnv.signInRedirectUrl)

    if (!res?.access_token) {
      throw createError({
        statusCode: 400,
        message: 'Not correct code',
      })
    }

    const twitchAccessToken = await db.twitchAccessToken.create({
      data: {
        id: createId(),
        userId: profile.twitchId,
        accessToken: res.access_token,
        refreshToken: res.refresh_token,
        scope: res.scope,
        expiresIn: res.expires_in,
        obtainmentTimestamp: new Date().getTime().toString(),
      },
    })

    const token = await db.twitchToken.create({
      data: {
        id: createId(),
        accessTokenId: twitchAccessToken.id,
        profileId: profile.id,
        status: 'ACTIVE',
        type: 'ADDON',
      },
    })

    return {
      ok: true,
      result: token as TwitchToken,
    }
  }
)

async function obtainTwitchAccessToken(code: string, redirectUrl: string) {
  const { public: publicEnv, twitchSecretId } = useRuntimeConfig()
  const clientId = publicEnv.twitchClientId

  try {
    const response = await fetch(
      `https://id.twitch.tv/oauth2/token?client_id=${clientId}&client_secret=${twitchSecretId}&code=${code}&grant_type=authorization_code&redirect_uri=${redirectUrl}`,
      {
        method: 'POST',
      }
    )
    return (await response.json()) as TwitchAccessTokenResponse
  } catch (err) {
    console.error('obtainTwitchAccessToken', err)
    return null
  }
}
