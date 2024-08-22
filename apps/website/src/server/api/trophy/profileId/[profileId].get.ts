import type { EventHandlerRequest } from 'h3'
import type { TrophyEditionWithTrophy } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<TrophyEditionWithTrophy[]>>(
  async (event) => {
    const profileId = getRouterParam(event, 'profileId')

    const progress = (await db.trophyEdition.findMany({
      where: { profileId },
      include: {
        trophy: true,
      },
      orderBy: { createdAt: 'desc' },
    })) as TrophyEditionWithTrophy[]
    if (!progress) {
      throw createError({
        status: 404,
      })
    }

    return progress
  }
)
