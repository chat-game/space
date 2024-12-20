import { createId } from '@paralleldrive/cuid2'

export default defineEventHandler(async (event) => {
  const telegramId = getRouterParam(event, 'profileId')
  const characterId = getRouterParam(event, 'characterId')

  const telegramProfile = await prisma.telegramProfile.findFirst({
    where: { id: telegramId },
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

  await prisma.transaction.create({
    data: {
      id: createId(),
      profileId: telegramProfile.profile.id,
      entityId: edition.id,
      amount: character.price,
      type: 'POINTS_FROM_CHARACTER_UNLOCK',
    },
  })

  await prisma.profile.update({
    where: { id: telegramProfile.profile.id },
    data: {
      coins: {
        decrement: character.price,
      },
      collectorPoints: {
        increment: character.price,
      },
    },
  })

  return {
    ok: true,
  }
})
