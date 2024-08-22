import type { EventHandlerRequest } from 'h3'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<{ ok: boolean }>>(async (event) => {
  const id = getRouterParam(event, 'id')

  const token = await db.twitchToken.findFirst({
    where: { id },
  })
  if (!token) {
    throw createError({
      status: 404,
    })
  }

  await db.twitchToken.update({
    where: { id },
    data: {
      onlineAt: new Date(),
    },
  })

  return {
    ok: true,
  }
})
