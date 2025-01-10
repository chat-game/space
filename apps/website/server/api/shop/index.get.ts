export default defineEventHandler(
  async () => {
    const products = await prisma.product.findMany({
      where: { isActive: true },
      orderBy: {
        priority: 'asc',
      },
      include: {
        items: {
          orderBy: {
            priority: 'asc',
          },
        },
      },
    })
    if (!products.length) {
      return []
    }

    return products
  },
)
