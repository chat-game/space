import type { EventHandlerRequest } from 'h3'
import { createId } from '@paralleldrive/cuid2'
import type { TrophyCreateResponse } from '@chat-game/types'

export default defineEventHandler<EventHandlerRequest, Promise<TrophyCreateResponse>>(
  async (event) => {
    const body = await readBody(event)

    if (!body.profileId || !body.name || !body.description) {
      throw createError({
        statusCode: 400,
        message: 'You must provide data',
      })
    }

    const profile = await prisma.profile.findUnique({
      where: { id: body.profileId, mana: { gte: 5 } },
    })
    if (!profile) {
      throw createError({
        status: 404,
      })
    }

    // Take payment
    await prisma.profile.update({
      where: { id: profile.id },
      data: {
        mana: { decrement: 5 },
      },
    })

    // sanitize, max chars
    const name = body.name.trim().substring(0, 35)
    const description = body.description.trim().substring(0, 140)

    const trophy = await prisma.trophy.create({
      data: {
        id: createId(),
        name,
        description,
        profileId: body.profileId,
        points: 10,
        rarity: 0,
      },
    })

    return {
      ok: true,
      result: trophy,
    }
  },
)
