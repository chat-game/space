export default defineEventHandler(async () => {
  const characters = await prisma.character.findMany({
    orderBy: {
      coefficient: 'asc',
      price: 'asc',
    },
    include: {
      editions: true,
      levels: {
        orderBy: {
          level: 'asc',
        },
      },
    },
  })
  if (!characters?.length) {
    return []
  }

  return characters
})
