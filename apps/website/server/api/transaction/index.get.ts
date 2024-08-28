export default defineEventHandler(
  async () => {
    const transactions = await prisma.transaction.findMany({
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 15,
    })

    return transactions
  },
)
