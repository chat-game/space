import type { EventHandlerRequest } from 'h3'
import type { TrophyWithEditions } from '@chat-game/types'

export default defineEventHandler<EventHandlerRequest, Promise<TrophyWithEditions>>(
  async (event) => {
    const id = getRouterParam(event, 'id')

    const trophy = (await prisma.trophy.findFirst({
      where: { id },
      include: {
        editions: {
          include: {
            profile: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        profile: true,
      },
    })) as TrophyWithEditions
    if (!trophy) {
      throw createError({
        status: 404,
      })
    }

    return trophy
  },
)
