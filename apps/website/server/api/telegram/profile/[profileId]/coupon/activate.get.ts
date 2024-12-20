export default defineEventHandler(async (event) => {
  const telegramId = getRouterParam(event, 'profileId')

  const query = getQuery(event)
  const type = query?.type?.toString()

  const telegramProfile = await prisma.telegramProfile.findFirst({
    where: { id: telegramId },
    include: {
      profile: true,
    },
  })
  if (!telegramProfile || !telegramProfile?.profile) {
    throw createError({
      status: 404,
    })
  }

  if (telegramProfile.profile.coupons <= 0) {
    throw createError({
      status: 400,
      message: 'You do not have enough coupons',
    })
  }

  if (type === 'coins') {
    await prisma.profile.update({
      where: { id: telegramProfile.profile.id },
      data: {
        coins: {
          increment: 2,
        },
      },
    })
  }

  await prisma.profile.update({
    where: { id: telegramProfile.profile.id },
    data: {
      coupons: {
        decrement: 1,
      },
    },
  })

  return { ok: true }
})
