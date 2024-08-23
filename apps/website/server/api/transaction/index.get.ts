import type { EventHandlerRequest } from 'h3'
import type { TransactionWithProfile } from '@chat-game/types'

export default defineEventHandler<EventHandlerRequest, Promise<TransactionWithProfile[]>>(
  async () => {
    const transactions = await prisma.transaction.findMany({
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    return transactions as TransactionWithProfile[]
  },
)
