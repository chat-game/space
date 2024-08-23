import type { EventHandlerRequest } from 'h3'

export default defineEventHandler<EventHandlerRequest, Promise<{ ok: boolean }>>(async (event) => {
  const id = getRouterParam(event, 'id')

  const token = await prisma.twitchToken.findFirst({
    where: { id },
  })
  if (!token) {
    throw createError({
      status: 404,
    })
  }

  await prisma.twitchToken.update({
    where: { id },
    data: {
      onlineAt: new Date(),
    },
  })

  return {
    ok: true,
  }
})
