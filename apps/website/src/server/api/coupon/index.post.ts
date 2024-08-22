import type { EventHandlerRequest } from 'h3'
import { createId } from '@paralleldrive/cuid2'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<{ ok: true }>>(async (event) => {
  const body = await readBody(event)

  if (!body.profileId || !body.type) {
    throw createError({
      statusCode: 400,
      message: 'You must provide profileId and type',
    })
  }

  const profile = await db.profile.findFirst({
    where: { id: body.profileId },
  })
  if (!profile) {
    throw createError({
      status: 404,
    })
  }

  if (body.type === 'COINS' && profile.coupons > 0) {
    await db.profile.update({
      where: { id: profile.id },
      data: {
        coins: {
          increment: 2,
        },
        coupons: {
          decrement: 1,
        },
      },
    })

    await db.transaction.create({
      data: {
        id: createId(),
        profileId: profile.id,
        entityId: profile.id,
        amount: 2,
        type: 'COINS_FROM_COUPON',
      },
    })
  }

  return {
    ok: true,
  }
})
