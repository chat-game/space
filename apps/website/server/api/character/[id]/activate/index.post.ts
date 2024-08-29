export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const session = await getUserSession(event)

  if (!session?.user) {
    throw createError({
      statusCode: 400,
      message: 'Invalid data',
    })
  }

  const profile = await prisma.profile.findUnique({
    where: { id: session?.user.id },
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
