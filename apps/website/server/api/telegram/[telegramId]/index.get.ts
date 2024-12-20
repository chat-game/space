export default defineEventHandler(async (event) => {
  try {
    const telegramId = getRouterParam(event, 'telegramId')
    if (!telegramId) {
      throw createError({
        statusCode: 400,
        message: 'You must provide telegramId',
      })
    }

    const query = getQuery(event)
    const username = query?.username?.toString()

    const profile = await prisma.telegramProfile.findFirst({
      where: { telegramId },
      include: {
        profile: {
          include: {
            trophyEditions: {
              include: {
                trophy: true,
              },
            },
            characterEditions: true,
            itemEditions: {
              include: {
                item: true,
              },
            },
          },
        },
      },
    })
    if (!profile) {
      const repository = new DBRepository()
      const profile = await repository.findOrCreateTelegramProfile({
        telegramId,
        username,
      })

      return profile
    }

    return profile
  } catch (error) {
    throw errorResolver(error)
  }
})
