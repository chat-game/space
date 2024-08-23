import type { EventHandlerRequest } from 'h3'
import { createId } from '@paralleldrive/cuid2'

export default defineEventHandler<EventHandlerRequest, Promise<{ ok: boolean }>>(async (event) => {
  const id = getRouterParam(event, 'id')

  const body = await readBody(event)

  if (!body.profileId) {
    throw createError({
      statusCode: 400,
      message: 'You must provide profileId',
    })
  }

  const profile = await prisma.profile.findUnique({
    where: { id: body.profileId },
    include: {
      characterEditions: true,
    },
  })
  if (!profile) {
    throw createError({
      status: 404,
    })
  }

  const character = await prisma.character.findUnique({
    where: { id, isReady: true, unlockedBy: 'COINS' },
  })
  if (!character) {
    throw createError({
      status: 404,
    })
  }

  // If already have this char
  if (profile.characterEditions.some((edition) => edition.characterId === id)) {
    throw createError({
      status: 400,
      message: 'You already have this character',
    })
  }

  // Don't have enough coins
  if (profile.coins < character.price) {
    throw createError({
      status: 400,
      message: 'You dont have enough coins',
    })
  }

  const edition = await prisma.characterEdition.create({
    data: {
      id: createId(),
      profileId: profile.id,
      characterId: character.id,
    },
  })

  await prisma.transaction.create({
    data: {
      id: createId(),
      profileId: profile.id,
      entityId: edition.id,
      amount: character.price,
      type: 'CHARACTER_UNLOCK',
    },
  })

  await prisma.transaction.create({
    data: {
      id: createId(),
      profileId: profile.id,
      entityId: edition.id,
      amount: character.price,
      type: 'POINTS_FROM_CHARACTER_UNLOCK',
    },
  })

  await prisma.profile.update({
    where: { id: profile.id },
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
