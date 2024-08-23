import type { EventHandlerRequest } from 'h3'
import type { TrophyEditionWithTrophy } from '@chat-game/types'

export default defineEventHandler<EventHandlerRequest, Promise<TrophyEditionWithTrophy[]>>(
  async (event) => {
    const profileId = getRouterParam(event, 'profileId')

    const progress = (await prisma.trophyEdition.findMany({
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
  },
)
