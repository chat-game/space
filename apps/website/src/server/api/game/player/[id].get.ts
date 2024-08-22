import type { EventHandlerRequest } from 'h3'
import type { Player } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<Player>>(async (event) => {
  const id = getRouterParam(event, 'id')

  const player = await db.player.findUnique({
    where: { id },
  })
  if (!player) {
    throw createError({
      status: 404,
    })
  }

  return player
})
