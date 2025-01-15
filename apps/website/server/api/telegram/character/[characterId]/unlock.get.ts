import { createId } from '@paralleldrive/cuid2'
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

    const character = await prisma.character.findUnique({
      where: { id: characterId, unlockedBy: 'COINS' },
    })
    if (!character) {
      throw createError({
        status: 404,
      })
    }

    // If already have this char
    if (telegramProfile.profile.characterEditions.some((edition) => edition.characterId === characterId)) {
      throw createError({
        status: 400,
        message: 'You already have this character',
      })
    }

    // Don't have enough coins
    if (telegramProfile.profile.coins < character.price) {
      throw createError({
        status: 400,
        message: 'You dont have enough coins',
      })
    }

    const edition = await prisma.characterEdition.create({
      data: {
        id: createId(),
        profileId: telegramProfile.profile.id,
        characterId: character.id,
      },
    })

    await prisma.transaction.create({
      data: {
        id: createId(),
        profileId: telegramProfile.profile.id,
        entityId: edition.id,
        amount: character.price,
        type: 'CHARACTER_UNLOCK',
      },
    })

    await prisma.profile.update({
      where: { id: telegramProfile.profile.id },
      data: {
        coins: {
          decrement: character.price,
        },
        points: {
          increment: character.price * 10,
        },
      },
    })

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})
