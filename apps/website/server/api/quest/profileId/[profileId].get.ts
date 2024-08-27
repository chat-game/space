export default defineEventHandler(
  async (event) => {
    const profileId = getRouterParam(event, 'profileId')

    const quests = (await prisma.quest.findMany({
      include: {
        editions: {
          where: { profileId },
        },
        rewards: true,
        profile: true,
      },
    }))
    if (!quests) {
      throw createError({
        status: 404,
      })
    }

    return quests
  },
)
