import type { EventHandlerRequest } from 'h3'
import type { Inventory, InventoryItem } from '@chat-game/types'

export default defineEventHandler<EventHandlerRequest, Promise<Inventory>>(async (event) => {
  const id = getRouterParam(event, 'id')

  const inventory = await prisma.inventory.findUnique({
    where: { id },
  })
  if (!inventory) {
    throw createError({
      status: 404,
    })
  }

  const items = (await prisma.inventoryItem.findMany({
    where: { inventoryId: inventory.id },
  })) as InventoryItem[]

  return {
    ...inventory,
    items,
  }
})
