import { removeItemFromInventory } from '~~/server/core/inventory/item'
import { validateTelegramData } from '~~/server/core/telegram/validate'

export default defineEventHandler(async (event) => {
  try {
    const telegram = validateTelegramData(event)
    if (!telegram?.user) {
      throw createError({
        statusCode: 400,
        message: 'User is not valid',
      })
    }

    const telegramId = telegram.user.id.toString()
    const itemId = getRouterParam(event, 'itemId')

    const telegramProfile = await prisma.telegramProfile.findFirst({
      where: { telegramId },
      include: {
        profile: true,
      },
    })
    if (!telegramProfile || !telegramProfile?.profile) {
      throw createError({
        status: 404,
      })
    }

    const item = await prisma.inventoryItemEdition.findFirst({
      where: { id: itemId },
    })
    if (!item || item?.amount <= 0) {
      throw createError({
        status: 400,
        message: 'You do not have enough items',
      })
    }

    // Remove item
    await removeItemFromInventory({ itemEditionId: item.id, amount: 1 })

    // Add reward
    await collectRewardForItemActivation(item.itemId, telegramProfile.profile.id)

    return { ok: true }
  } catch (error) {
    throw errorResolver(error)
  }
})

async function collectRewardForItemActivation(itemId: string, profileId: string) {
  if (itemId === 'k088f2b5i8murh77md1gvaoa') {
    // Banana: +100 WP, +1 Coin
    return prisma.profile.update({
      where: { id: profileId },
      data: {
        coins: {
          increment: 1,
        },
        points: {
          increment: 100,
        },
      },
    })
  }
}
