export default defineEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')

    const trophy = (await prisma.trophy.findFirst({
      where: { id },
      include: {
        editions: {
          include: {
            profile: true,
          },
          orderBy: { createdAt: 'desc' },
          take: 50,
        },
        profile: true,
      },
    }))
    if (!trophy) {
      throw createError({
        status: 404,
      })
    }

    return trophy
  },
)
