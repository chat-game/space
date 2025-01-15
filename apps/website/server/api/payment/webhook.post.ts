import type { EventHandlerRequest } from 'h3'
import { createId } from '@paralleldrive/cuid2'

export default defineEventHandler<EventHandlerRequest, Promise<{ ok: boolean }>>(async (event) => {
  const body = await readBody(event)
  const logger = useLogger('payment-webhook')

  if (!body?.event) {
    throw createError({
      statusCode: 400,
      message: 'No data',
    })
  }

  if (body.event === 'payment.succeeded') {
    logger.log('payment.succeeded', JSON.stringify(body))

    const payment = await prisma.payment.findFirst({
      where: {
        externalId: body.object.id,
      },
    })
    if (!payment) {
      throw createError({
        statusCode: 400,
        message: 'No payment found',
      })
    }

    if (payment.status !== 'PAID') {
      const product = await prisma.product.findFirst({
        where: { id: payment.productId },
        include: {
          items: true,
        },
      })

      if (payment.productId === 'jehj4mxo0g6fp1eopf3jg641') {
        await activateProduct1(payment.profileId)
      }
      if (payment.productId === 'w0895g3t9q75ys2maod0zd1a') {
        await activateProduct2(payment.profileId)
      }
      if (payment.productId === 'nar1acws8c3s4w3cxs6i8qdn') {
        await activateProduct3(payment.profileId)
      }
      if (payment.productId === 'tp5w874gchf6hjfca9vory2r') {
        await activateProduct4(payment.profileId)
      }
      if (payment.productId === 'izh5v4vxztqi55gquts9ukn2') {
        await activateProduct5(payment.profileId)
      }

      // patron points
      const itemPatronPoints = product?.items.find(({ type }) => type === 'PATRON_POINT')
      if (itemPatronPoints) {
        const increment = itemPatronPoints.amount
        await prisma.profile.update({
          where: { id: payment.profileId },
          data: {
            patronPoints: {
              increment,
            },
            points: {
              increment,
            },
          },
        })
      }

      await prisma.payment.update({
        where: { id: payment.id },
        data: {
          status: 'PAID',
        },
      })
    }
  }

  return {
    ok: true,
  }
})

function activateProduct1(profileId: string) {
  // 10 coins
  return prisma.profile.update({
    where: { id: profileId },
    data: {
      coins: {
        increment: 10,
      },
    },
  })
}

function activateProduct2(profileId: string) {
  // 50+10 coins
  return prisma.profile.update({
    where: { id: profileId },
    data: {
      coins: {
        increment: 60,
      },
    },
  })
}

function activateProduct3(profileId: string) {
  // 150+30 coins
  return prisma.profile.update({
    where: { id: profileId },
    data: {
      coins: {
        increment: 180,
      },
    },
  })
}

function activateProduct4(profileId: string) {
  // 250+80 coins
  return prisma.profile.update({
    where: { id: profileId },
    data: {
      coins: {
        increment: 330,
      },
    },
  })
}

async function activateProduct5(profileId: string) {
  // 500+150 coins
  await prisma.profile.update({
    where: { id: profileId },
    data: {
      coins: {
        increment: 650,
      },
    },
  })

  // check if already have char
  const char = await prisma.characterEdition.findFirst({
    where: { profileId, characterId: 'w22vo3qzgfmvgt85ncfg398i' },
  })
  if (!char) {
    await prisma.characterEdition.create({
      data: {
        id: createId(),
        profileId,
        characterId: 'w22vo3qzgfmvgt85ncfg398i',
      },
    })
  }
}
