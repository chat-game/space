export default defineEventHandler(
  async (event) => {
    const characterId = getRouterParam(event, 'id')

    const editions = await prisma.characterEdition.findMany({
      where: { characterId },
      orderBy: { xp: 'desc' },
      take: 10,
      include: {
        profile: true,
        character: true,
      },
    })
    if (!editions) {
      throw createError({
        status: 404,
      })
    }

    return editions.slice(0, 6)
  },
)
