import { createId } from '@paralleldrive/cuid2'

export async function addItemToInventory(data: { profileId: string, itemId: string, amount: number }) {
  if (!data.amount || data.amount <= 0) {
    return
  }

  const item = await prisma.inventoryItemEdition.findFirst({
    where: { profileId: data.profileId, itemId: data.itemId },
  })
  if (item) {
    return prisma.inventoryItemEdition.update({
      where: { id: item?.id },
      data: {
        amount: {
          increment: data.amount,
        },
      },
    })
  }

  return prisma.inventoryItemEdition.create({
    data: {
      id: createId(),
      itemId: data.itemId,
      profileId: data.profileId,
      amount: data.amount,
    },
  })
}

export async function removeItemFromInventory({ itemEditionId, amount }: { itemEditionId: string, amount: number }) {
  if (!amount || amount <= 0) {
    return
  }

  const item = await prisma.inventoryItemEdition.findFirst({
    where: { id: itemEditionId },
  })
  if (!item) {
    return
  }

  // Will be zero?
  if (item.amount - amount <= 0) {
    return prisma.inventoryItemEdition.delete({
      where: { id: item.id },
    })
  }

  return prisma.inventoryItemEdition.update({
    where: { id: item.id },
    data: {
      amount: {
        decrement: amount,
      },
    },
  })
}
