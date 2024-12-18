export default defineEventHandler(async (event) => {
  const telegramId = getRouterParam(event, 'telegramId')
  const characterId = getRouterParam(event, 'characterId')

  const telegramProfile = await prisma.telegramProfile.findFirst({
    where: { id: telegramId },
    include: {
      profile: {
        include: {
          characterEditions: true,
        },
      },
    },
  })
  if (!telegramProfile || !telegramProfile?.profile) {
    throw createError({
      status: 404,
    })
  }

  const edition = telegramProfile.profile.characterEditions.find((e) => e.characterId === characterId)
  if (!edition) {
    throw createError({
      status: 400,
      message: 'You do not have this character',
    })
  }

  await prisma.profile.update({
    where: { id: telegramProfile.profile.id },
    data: {
      activeEditionId: edition.id,
    },
  })

  return { ok: true }
})
