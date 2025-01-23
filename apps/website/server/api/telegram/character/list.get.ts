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
            characterEditions: {
              include: {
                character: {
                  include: {
                    levels: {
                      include: {
                        inventoryItem: true,
                      },
                    },
                  },
                },
              },
            },
          },
        },
      },
    })
    if (!profile || !profile?.profile) {
      throw createError({
        status: 404,
      })
    }

    return profile.profile.characterEditions
  } catch (error) {
    throw errorResolver(error)
  }
})
