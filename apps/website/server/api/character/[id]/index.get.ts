export default defineEventHandler(
  async (event) => {
    const id = getRouterParam(event, 'id')

    const character = await prisma.character.findFirst({
      where: { id },
    })
    if (!character) {
      throw createError({
        status: 404,
      })
    }

    return character
  },
)
