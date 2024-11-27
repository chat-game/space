import type { EventHandlerRequest } from 'h3'
import { createId } from '@paralleldrive/cuid2'

export default defineEventHandler<EventHandlerRequest, Promise<{ ok: boolean }>>(async (event) => {
  const profileId = getRouterParam(event, 'id')
  const body = await readBody(event)

  if (!body.characterId) {
    throw createError({
      statusCode: 400,
      message: 'You must provide data',
    })
  }

  const profile = await prisma.profile.findUnique({
    where: { id: profileId },
    include: {
      trophyEditions: true,
    },
  })
  if (!profile) {
    throw createError({
      status: 404,
    })
  }

  const character = await prisma.character.findUnique({
    where: { id: body.characterId, isReady: true },
  })
  if (!character) {
    throw createError({
      status: 404,
    })
  }

  // Check, if already have
  const editionAlready = await prisma.characterEdition.findFirst({
    where: {
      profileId,
      characterId: body.characterId,
    },
  })
  if (editionAlready?.id) {
    throw createError({
      status: 400,
      message: 'You already have this character',
    })
  }

  // Give new edition
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
      collectorPoints: {
        increment: character.price,
      },
    },
  })

  // Check trophy
  if (
    !profile.trophyEditions.some((progress) => progress.trophyId === 'h09eur7whn4nyjr0bereyb5l')
  ) {
    await prisma.trophyEdition.create({
      data: {
        id: createId(),
        profileId: profile.id,
        trophyId: 'h09eur7whn4nyjr0bereyb5l',
      },
    })

    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        trophyHunterPoints: {
          increment: 50,
        },
      },
    })
  }

  // Donate points
  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      patronPoints: {
        increment: (character.price / 2) * 10,
      },
    },
  })

  return {
    ok: true,
  }
})
