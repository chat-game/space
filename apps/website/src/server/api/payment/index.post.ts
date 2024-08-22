import process from 'node:process'
import type { EventHandlerRequest } from 'h3'
import { createId } from '@paralleldrive/cuid2'
import type { Payment, PaymentCreateResponse } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<PaymentCreateResponse>>(
  async (event) => {
    const body = await readBody(event)

    if (!body.profileId || !body.productId) {
      throw createError({
        statusCode: 400,
        message: 'No data',
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

    const product = await db.product.findFirst({
      where: { id: body.productId },
    })
    if (!product) {
      throw createError({
        status: 404,
      })
    }

    // Create payment on Provider
    const paymentBody = {
      amount: {
        value: product.price,
        currency: 'RUB',
      },
      capture: true,
      description: `Приобретение "${product.title}" для профиля ID ${profile.id}`,
      metadata: {
        profileId: profile.id,
        productId: product.id,
      },
      confirmation: {
        type: 'redirect',
        return_url: 'https://chatgame.space/ru/shop',
      },
    }

    const credentials = btoa(
      `${process.env.PRIVATE_YOOKASSA_SHOP_ID}:${process.env.PRIVATE_YOOKASSA_API_KEY}`
    )
    const res = await fetch(`https://api.yookassa.ru/v3/payments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotence-Key': createId(),
        Authorization: `Basic ${credentials}`,
      },
      body: JSON.stringify(paymentBody),
    })

    const paymentOnProvider = await res.json()
    if (!paymentOnProvider.id) {
      throw createError({
        status: 400,
      })
    }

    const redirectUrl = paymentOnProvider.confirmation.confirmation_url

    // Create payment
    const payment = await db.payment.create({
      data: {
        id: createId(),
        externalId: paymentOnProvider.id,
        provider: 'YOOKASSA',
        profileId: profile.id,
        productId: product.id,
        status: 'PENDING',
        amount: product.price,
      },
    })

    return {
      ok: true,
      result: {
        payment: payment as Payment,
        redirectUrl,
      },
    }
  }
)
