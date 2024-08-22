import type { EventHandlerRequest } from 'h3'
import type { ProfileCreateResponse } from '@chat-game/types'
import { DBRepository } from '../../utils/repository'

export default defineEventHandler<EventHandlerRequest, Promise<ProfileCreateResponse>>(
  async (event) => {
    const body = await readBody(event)

    if (!body.twitchId || !body.userName) {
      throw createError({
        statusCode: 400,
        message: 'You must provide twitchId and userName',
      })
    }

    const repository = new DBRepository()
    const profile = await repository.findOrCreateProfile({
      userId: body.twitchId,
      userName: body.userName,
    })

    return {
      ok: true,
      result: profile,
    }
  }
)
