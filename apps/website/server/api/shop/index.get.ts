export default defineEventHandler(
  async () => {
    const products = await prisma.product.findMany({
      orderBy: {
        priority: 'asc',
      },
    })
    if (!products.length) {
      return []
    }

    return products
  },
)
