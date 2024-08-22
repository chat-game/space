import type { EventHandlerRequest } from 'h3'
import type { Trophy } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<Trophy[]>>(async () => {
  return db.trophy.findMany()
})
