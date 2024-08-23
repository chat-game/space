import type { EventHandlerRequest } from 'h3'

export default defineEventHandler<EventHandlerRequest, Promise<{ ok: boolean }>>(async (event) => {
  const id = getRouterParam(event, 'id')

  const body = await readBody(event)

  if (!body.profileId) {
    throw createError({
      statusCode: 400,
      message: 'You must provide profileId',
    })
  }

  const profile = await prisma.profile.findUnique({
    where: { id: body.profileId },
    include: {
      characterEditions: true,
    },
  })
  if (!profile) {
    throw createError({
      status: 404,
    })
  }

  const edition = profile.characterEditions.find((e) => e.characterId === id)

  // Don't have this char
  if (!edition) {
    throw createError({
      status: 400,
      message: 'You do not have this character',
    })
  }

  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      activeEditionId: edition.id,
    },
  })

  return {
    ok: true,
  }
})
