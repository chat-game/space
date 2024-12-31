import { validateTelegramData } from '~~/server/core/telegram/validate'

export default defineEventHandler(async (event) => {
  try {
    const telegram = validateTelegramData(event)
    if (!telegram?.user) {
      throw createError({
        statusCode: 400,
        message: 'User is not valid',
      })
    }

    const telegramId = telegram.user.id.toString()
    const characterId = getRouterParam(event, 'characterId')

    const telegramProfile = await prisma.telegramProfile.findFirst({
      where: { telegramId },
      include: {
        profile: {
          include: {
            characterEditions: true,
          },
        },
      },
    })
    if (!telegramProfile || !telegramProfile?.profile) {
      throw createError({
        status: 404,
      })
    }

    const edition = telegramProfile.profile.characterEditions.find((e) => e.characterId === characterId)
    if (!edition) {
      throw createError({
        status: 400,
        message: 'You do not have this character',
      })
    }

    await prisma.profile.update({
      where: { id: telegramProfile.profile.id },
      data: {
        activeEditionId: edition.id,
      },
    })

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
