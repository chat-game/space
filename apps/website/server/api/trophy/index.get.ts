import type { EventHandlerRequest } from 'h3'
import type { Trophy } from '@chat-game/types'

export default defineEventHandler<EventHandlerRequest, Promise<Trophy[]>>(async () => {
  return prisma.trophy.findMany()
})
