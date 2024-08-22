import type { EventHandlerRequest } from 'h3'
import { createId } from '@paralleldrive/cuid2'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<{ ok: boolean }>>(async (event) => {
  const body = await readBody(event)

  if (!body?.event) {
    throw createError({
      statusCode: 400,
      message: 'No data',
    })
  }

  if (body.event === 'payment.succeeded') {
    log('[Payment] payment.succeeded', JSON.stringify(body))

    const payment = await db.payment.findFirst({
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
      await db.profile.update({
        where: { id: payment.profileId },
        data: {
          patronPoints: {
            increment: payment.amount,
          },
        },
      })

      await db.payment.update({
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
  return db.profile.update({
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
  return db.profile.update({
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
  return db.profile.update({
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
  return db.profile.update({
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
  await db.profile.update({
    where: { id: profileId },
    data: {
      coins: {
        increment: 650,
      },
    },
  })

  // check if already have char
  const char = await db.characterEdition.findFirst({
    where: { profileId, characterId: 'w22vo3qzgfmvgt85ncfg398i' },
  })
  if (!char) {
    await db.characterEdition.create({
      data: {
        id: createId(),
        profileId,
        characterId: 'w22vo3qzgfmvgt85ncfg398i',
      },
    })
  }
}
