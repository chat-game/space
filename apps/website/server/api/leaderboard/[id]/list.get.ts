export default defineEventHandler(async (event) => {
  const id = getRouterParam(event, 'id')
  const query = getQuery(event)
  const limit = query.limit ? Number.parseInt(query.limit.toString()) : 500

  const leaderboard = await prisma.leaderboard.findUnique({
    where: { id },
    include: {
      members: {
        orderBy: {
          position: 'asc',
        },
        take: limit,
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
