import type { EventHandlerRequest } from 'h3'
import type { TransactionWithProfile } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<TransactionWithProfile[]>>(
  async () => {
    const transactions = await db.transaction.findMany({
      include: {
        profile: true,
      },
      orderBy: {
        createdAt: 'desc',
      },
      take: 50,
    })

    return transactions as TransactionWithProfile[]
  }
)
