export default defineEventHandler(async (event) => {
  try {
    const telegramId = getRouterParam(event, 'telegramId')

    const profile = await prisma.telegramProfile.findFirst({
      where: { telegramId },
      include: {
        profile: true,
      },
    })
    if (!profile) {
      throw createError({
        status: 404,
      })
    }

    return profile
  } catch (error) {
    throw errorResolver(error)
  }
})
