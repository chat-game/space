export default defineEventHandler(
  async (event) => {
    const userName = getRouterParam(event, 'userName')

    const profile = await prisma.profile.findFirst({
      where: { userName },
      include: {
        characterEditions: {
          include: {
            character: true,
          },
        },
      },
    })
    if (!profile) {
      throw createError({
        status: 404,
      })
    }

    return profile
  },
)
