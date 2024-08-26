export default defineEventHandler(
  async () => {
    const characters = await prisma.character.findMany({
      orderBy: {
        price: 'asc',
      },
      include: {
        editions: true,
      },
    })

    if (!characters.length) {
      return []
    }

    return characters
  },
)
