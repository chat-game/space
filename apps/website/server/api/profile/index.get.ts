import type { EventHandlerRequest } from 'h3'
import type { ProfileInfoResponse } from '@chat-game/types'

export default defineEventHandler<EventHandlerRequest, Promise<ProfileInfoResponse>>(async () => {
  const count = await prisma.profile.count()

  return { count }
})
