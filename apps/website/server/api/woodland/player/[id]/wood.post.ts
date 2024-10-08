import type { EventHandlerRequest } from 'h3'

export default defineEventHandler<EventHandlerRequest, Promise<{ ok: boolean }>>(async (event) => {
  const playerId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!body?.wood) {
    throw createError({
      statusCode: 400,
      message: 'You must provide data',
    })
  }

  const player = await prisma.woodlandPlayer.findFirst({
    where: { id: playerId },
  })
  if (!player) {
    throw createError({
      statusCode: 400,
      message: 'Player not found',
    })
  }

  const wood: number = Number(body.wood)
  if (wood < 0 || !Number.isInteger(wood)) {
    throw createError({
      statusCode: 400,
      message: 'Wood must be a number',
    })
  }

  await prisma.woodlandPlayer.update({
    where: { id: player.id },
    data: {
      wood,
    },
  })

  return { ok: true }
})
