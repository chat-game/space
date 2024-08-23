import { createId } from '@paralleldrive/cuid2'
import type { EventHandlerRequest } from 'h3'
import type { TokenCreateResponse, TwitchToken } from '@chat-game/types'

export default defineEventHandler<EventHandlerRequest, Promise<TokenCreateResponse>>(
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

    const addon = await prisma.twitchToken.findFirst({
      where: { profileId: profile.id, type: 'ADDON' },
    })
    if (addon) {
      throw createError({
        statusCode: 400,
        message: 'Already have one',
      })
    }

    const token = await prisma.twitchToken.create({
      data: {
        id: createId(),
        profileId: profile.id,
        status: 'ACTIVE',
        type: 'ADDON',
      },
    })

    return {
      ok: true,
      result: token as TwitchToken,
    }
  },
)
