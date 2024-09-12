import type { Woodland } from '@chat-game/types'
import type { EventHandlerRequest } from 'h3'

export default defineEventHandler<EventHandlerRequest, Promise<Woodland>>(async (event) => {
  const id = getRouterParam(event, 'id')

  const woodland = await prisma.woodland.findFirst({
    where: { id },
    include: {
      players: true,
    },
  })
  if (!woodland) {
    throw createError({
      status: 404,
    })
  }

  return woodland as Woodland
})
