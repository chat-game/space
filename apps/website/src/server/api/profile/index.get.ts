import type { EventHandlerRequest } from 'h3'
import type { ProfileInfoResponse } from '@chat-game/types'
import { db } from '@chat-game/prisma-client'

export default defineEventHandler<EventHandlerRequest, Promise<ProfileInfoResponse>>(async () => {
  const count = await db.profile.count()

  return { count }
})
