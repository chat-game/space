import type { EventHandlerRequest } from 'h3'
import { createId } from '@paralleldrive/cuid2'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<{ ok: boolean }>>(async (event) => {
  const characterId = getRouterParam(event, 'id')

  const body = await readBody(event)

  if (!characterId || !body.profileId || !body.text) {
    throw createError({
      statusCode: 400,
      message: 'You must provide profileId and text',
    })
  }

  // Check if not have a coin
  const profile = await db.profile.findFirst({
    where: { id: body.profileId, mana: { gte: 5 } },
  })
  if (!profile?.id) {
    throw createError({
      status: 400,
      message: 'You do not have mana',
    })
  }

  // Take payment
  await db.profile.update({
    where: { id: profile.id },
    data: {
      mana: { decrement: 5 },
      storytellerPoints: { increment: 5 },
    },
  })

  // sanitize text, max 1500 chars
  const text = body.text.trim().substring(0, 1500)

  await db.post.create({
    data: {
      id: createId(),
      text,
      characterId,
      profileId: body.profileId,
      type: 'NOTE',
    },
  })

  return {
    ok: true,
  }
})
