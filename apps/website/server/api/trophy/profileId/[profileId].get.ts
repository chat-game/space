export default defineEventHandler(
  async (event) => {
    const profileId = getRouterParam(event, 'profileId')

    const progress = (await prisma.trophyEdition.findMany({
      where: { profileId },
      include: {
        trophy: true,
      },
      orderBy: { createdAt: 'desc' },
    }))
    if (!progress) {
      throw createError({
        status: 404,
      })
    }

    return progress
  },
)
