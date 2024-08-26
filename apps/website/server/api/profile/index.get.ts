export default defineEventHandler(async () => {
  const count = await prisma.profile.count()

  return { count }
})
