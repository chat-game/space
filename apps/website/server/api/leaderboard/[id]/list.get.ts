export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')

  const leaderboard = await prisma.leaderboard.findUnique({
    where: { id },
    include: {
      members: {
        orderBy: {
          points: 'desc',
        },
        take: 500,
        include: {
          profile: {
            include: {
              telegramProfile: true,
            },
          },
        },
      },
    },
  })
  if (!leaderboard) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Leaderboard not found',
    })
  }

  return leaderboard
})
