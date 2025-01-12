import { createId } from '@paralleldrive/cuid2'
import { gameBot } from '~~/server/core/telegram/bot'
import { validateTelegramData } from '~~/server/core/telegram/validate'

export default defineEventHandler(async (event) => {
  try {
    const logger = useLogger('telegramPayment')

    const telegram = validateTelegramData(event)
    if (!telegram?.user) {
      throw createError({
        statusCode: 400,
        message: 'User is not valid',
      })
    }

    const telegramId = telegram.user.id.toString()

    const query = getQuery(event)
    const productId = query.id?.toString()

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
    const link = await gameBot.api.createInvoiceLink(
      product.title,
      product.description,
      `{"payment_id":"${paymentId}"}`,
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
  } catch (error) {
    throw errorResolver(error)
  }
})
