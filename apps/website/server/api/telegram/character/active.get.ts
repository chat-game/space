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

    const profile = await prisma.telegramProfile.findFirst({
      where: { telegramId },
      include: {
        profile: {
          include: {
            characterEditions: true,
          },
        },
      },
    })
    if (!profile || !profile?.profile) {
      throw createError({
        status: 404,
      })
    }

    const character = profile.profile.characterEditions.find((e) => e.id === profile.profile?.activeEditionId)
    if (!character) {
      throw createError({
        status: 404,
      })
    }

    const levels = await prisma.characterLevel.findMany({
      where: { characterId: character.characterId },
    })

    const nextLevel = levels.find((l) => l.level === character.level + 1) ?? null
    const xpToNextLevel = nextLevel ? nextLevel.requiredXp - character.xp : null

    return {
      ...character,
      levels,
      nextLevel,
      xpToNextLevel,
    }
  } catch (error) {
    throw errorResolver(error)
  }
})
