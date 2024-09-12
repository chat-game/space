import type { Woodland } from '@chat-game/types'
import type { EventHandlerRequest } from 'h3'

export default defineEventHandler<EventHandlerRequest, Promise<Woodland[]>>(async (event) => {
  const profileId = getRouterParam(event, 'id')

  const woodlands = (await prisma.woodland.findMany({
    where: { profileId },
    include: {
      players: true,
    },
    orderBy: { createdAt: 'desc' },
    take: 50,
  })) as Woodland[]
  if (!woodlands) {
    throw createError({
      status: 404,
    })
  }

  return woodlands
})
