const logger = useLogger('game:leaderboard')

export default defineTask({
  meta: {
    name: 'game:leaderboard',
    description: 'Recalculate members positions on all Leaderboards',
  },
  async run() {
    try {
      const leaderboards = await prisma.leaderboard.findMany({
        include: {
          members: {
            orderBy: {
              points: 'desc',
            },
          },
        },
      })

      for (const lb of leaderboards) {
        // update all members positions: by points
        for (const [index, member] of lb.members.entries()) {
          await prisma.leaderboardMember.update({
            where: { id: member.id },
            data: {
              position: index + 1,
            },
          })
        }
      }
    } catch (error) {
      errorResolver(error)
    }

    logger.success('Done: Recalculate members positions on all Leaderboards')

    return { result: true }
  },
})
