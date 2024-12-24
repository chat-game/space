export default defineEventHandler(
  async () => {
    const products = await prisma.product.findMany({
      orderBy: {
        priority: 'asc',
      },
      include: {
        items: true,
      },
    })
    if (!products.length) {
      return []
    }

    return products
  },
)
