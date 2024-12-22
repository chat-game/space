import { createId } from '@paralleldrive/cuid2'
import { bot } from '~~/server/core/telegram/bot'

export default defineEventHandler(async (event) => {
  const logger = useLogger('telegramPayment')
  const telegramId = getRouterParam(event, 'profileId')
  const query = getQuery(event)
  const productId = query.id?.toString()

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

  const product = await prisma.product.findFirst({
    where: { id: productId },
  })
  if (!product) {
    throw createError({
      status: 404,
    })
  }

  // Create invoice via bot
  const paymentId = createId()
  const link = await bot.api.createInvoiceLink(
    product.title,
    product.description,
    `{payment_id:${paymentId}}`,
    '',
    'XTR',
    [
      { label: product.title, amount: product.starsPrice },
    ],
  )

  // Create payment
  await prisma.payment.create({
    data: {
      id: paymentId,
      externalId: link,
      provider: 'TELEGRAM',
      status: 'PENDING',
      profileId: telegramProfile.profile.id,
      productId: product.id,
      amount: product.starsPrice,
    },
  })

  logger.log('Payment link created', link, telegramProfile.profile.id, product.id, `${product.starsPrice} XTR`)

  return {
    ok: true,
    result: link,
  }
})
