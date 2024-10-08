import type { Player } from '@chat-game/types'
import type { EventHandlerRequest } from 'h3'

export default defineEventHandler<EventHandlerRequest, Promise<Player>>(async (event) => {
  const id = getRouterParam(event, 'id')

  const player = await prisma.player.findUnique({
    where: { id },
  })
  if (!player) {
    throw createError({
      status: 404,
    })
  }

  return player
})
