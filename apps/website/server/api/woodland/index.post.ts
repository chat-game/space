import { createId } from '@paralleldrive/cuid2'
import type { TwitchToken, Woodland, WoodlandCreateResponse } from '@chat-game/types'
import type { EventHandlerRequest } from 'h3'

export default defineEventHandler<EventHandlerRequest, Promise<WoodlandCreateResponse>>(
  async (event) => {
    const body = await readBody(event)

    if (!body.profileId) {
      throw createError({
        statusCode: 400,
        message: 'You must provide profileId',
      })
    }

    const profile = await prisma.profile.findFirst({
      where: { id: body.profileId },
    })
    if (!profile) {
      throw createError({
        statusCode: 400,
        message: 'Not correct profile',
      })
    }

    let token = await prisma.twitchToken.findFirst({
      where: { profileId: profile.id, type: 'WOODLAND' },
    })
    if (!token) {
      token = await prisma.twitchToken.create({
        data: {
          id: createId(),
          profileId: profile.id,
          status: 'ACTIVE',
          type: 'WOODLAND',
        },
      })
    }

    const woodland = await prisma.woodland.create({
      data: {
        id: createId(),
        profileId: profile.id,
        tokenId: token.id,
        status: 'CREATED',
      },
      include: {
        players: true,
      },
    })

    return {
      ok: true,
      result: {
        token: token as TwitchToken,
        woodland: woodland as Woodland,
      },
    }
  },
)
