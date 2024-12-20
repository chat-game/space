export default defineEventHandler(async () => {
  return prisma.inventoryItem.findMany()
})
