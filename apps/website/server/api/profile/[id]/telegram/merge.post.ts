import { notifyAdmin } from '~~/server/core/telegram/oldBot'

export default defineEventHandler(
  async (event) => {
    const profileId = getRouterParam(event, 'id')
    const data = await readBody(event)

    if (!data.telegramId) {
      throw createError({
        statusCode: 400,
        message: 'You must provide data',
      })
    }

    const profile = await prisma.profile.findFirst({
      where: { id: profileId },
    })
    if (!profile) {
      throw createError({
        statusCode: 400,
        message: 'Not correct profile',
      })
    }

    // Guard
    if (profile?.telegramProfileId) {
      throw createError({
        statusCode: 400,
        message: 'Already merged',
      })
    }

    // Guard
    const telegramProfile = await prisma.telegramProfile.findFirst({
      where: { telegramId: data.telegramId },
      include: {
        profile: {
          include: {
            characterEditions: true,
          },
        },
      },
    })
    if (!telegramProfile) {
      throw createError({
        statusCode: 400,
        message: 'No telegram profile with this ID',
      })
    }
    if (telegramProfile.profile && telegramProfile.profile.twitchId.length < 24) {
      throw createError({
        statusCode: 400,
        message: 'Not correct telegram profile',
      })
    }

    // Telegram-based profile
    await prisma.profile.update({
      where: { id: telegramProfile.profile?.id },
      data: {
        telegramProfileId: null,
      },
    })

    // Telegram-based chars
    const chars = telegramProfile.profile?.characterEditions ?? []
    for (const char of chars) {
      // Check if already exists
      const edition = await prisma.characterEdition.findFirst({
        where: { characterId: char.characterId, profileId: profile.id },
      })
      if (!edition) {
        // Change profileId
        await prisma.characterEdition.update({
          where: { id: char.id },
          data: {
            profileId: profile.id,
          },
        })
      }
    }

    await prisma.profile.update({
      where: { id: profileId },
      data: {
        telegramProfileId: telegramProfile.id,
      },
    })

    await notifyAdmin(`Профиль ChatGame ${profileId} был объединен с Telegram профилем ${telegramProfile.id}!`)

    return {
      ok: true,
    }
  },
)
