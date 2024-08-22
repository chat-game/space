import type { EventHandlerRequest } from 'h3'
import type { Woodland } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<Woodland[]>>(async (event) => {
  const profileId = getRouterParam(event, 'id')

  const woodlands = (await db.woodland.findMany({
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
