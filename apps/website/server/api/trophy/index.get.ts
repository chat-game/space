export default defineEventHandler(async () => {
  return prisma.trophy.findMany()
})
