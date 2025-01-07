export default defineEventHandler(async (event) => {
  try {
    const id = getRouterParam(event, 'id')

    const profile = await prisma.profile.findFirst({
      where: { id },
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

    return {
      ...profile,
      activeCharacter: profile.characterEditions.find((e) => e.id === profile.activeEditionId),
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
