export default defineEventHandler(
  async () => {
    const products = await prisma.product.findMany({
      orderBy: {
        priority: 'desc',
      },
    })
    if (!products.length) {
      return []
    }

    return products
  },
)
