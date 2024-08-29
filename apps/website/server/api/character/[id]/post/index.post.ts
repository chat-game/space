import { createId } from '@paralleldrive/cuid2'

export default defineEventHandler(async (event) => {
  const characterId = getRouterParam(event, 'id')

  const session = await getUserSession(event)
  const body = await readBody(event)

  if (!characterId || !session?.user || !body.text) {
    throw createError({
      statusCode: 400,
      message: 'You must provide text',
    })
  }

  // Check if not have mana
  const profile = await prisma.profile.findFirst({
    where: { id: session.user.id, mana: { gte: 5 } },
  })
  if (!profile?.id) {
    throw createError({
      status: 400,
      message: 'You do not have enough mana',
    })
  }

  // Take payment
  await prisma.profile.update({
    where: { id: profile.id },
    data: {
      mana: { decrement: 5 },
      storytellerPoints: { increment: 5 },
    },
  })

  // sanitize text, max 1500 chars
  const text = body.text.trim().substring(0, 1500)

  await prisma.post.create({
    data: {
      id: createId(),
      text,
      characterId,
      profileId: profile.id,
      type: 'NOTE',
    },
  })

  return {
    ok: true,
  }
})
