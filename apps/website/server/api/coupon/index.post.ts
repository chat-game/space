import { createId } from '@paralleldrive/cuid2'

export default defineEventHandler(async (event) => {
  const body = await readBody(event)
  const session = await getUserSession(event)

  if (!session?.user || !body.type) {
    throw createError({
      statusCode: 400,
      message: 'Invalid data',
    })
  }

  const type = body.type as string

  const profile = await prisma.profile.findFirst({
    where: { id: session.user.id, coupons: { gte: 1 } },
  })
  if (!profile) {
    throw createError({
      status: 404,
      message: 'You do not have enough coupons',
    })
  }

  if (type === 'COINS') {
    await prisma.profile.update({
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

    await prisma.transaction.create({
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
