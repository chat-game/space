import { createId } from '@paralleldrive/cuid2'

export async function dropChristmasCupcake(telegramId: string, type: 'TREE') {
  const itemId = 'k3bitdush5wqbwphhdfnxqtl'
  const leaderboardId = 'iq9f2634d3q3ans243dhxmj7'

  // tree: 10% chance
  if (type === 'TREE' && Math.random() < 0.1) {
    const telegramProfile = await prisma.telegramProfile.findFirst({
      where: { telegramId },
      include: {
        profile: {
          include: {
            itemEditions: true,
            leaderboardMembers: true,
          },
        },
      },
    })
    if (telegramProfile?.profile) {
      // add item or +1 to amount
      const item = telegramProfile.profile.itemEditions.find((item) => item.itemId === itemId)
      if (item) {
        await prisma.inventoryItemEdition.update({
          where: { id: item?.id },
          data: {
            amount: {
              increment: 1,
            },
          },
        })
      } else {
        await prisma.inventoryItemEdition.create({
          data: {
            id: createId(),
            itemId,
            profileId: telegramProfile.profile.id,
            amount: 1,
          },
        })
      }

      // add +1 to leaderboard member
      const member = telegramProfile.profile.leaderboardMembers.find((member) => member.leaderboardId === leaderboardId)
      if (member) {
        await prisma.leaderboardMember.update({
          where: { id: member?.id },
          data: {
            points: {
              increment: 1,
            },
          },
        })
      } else {
        await prisma.leaderboardMember.create({
          data: {
            id: createId(),
            leaderboardId,
            profileId: telegramProfile.profile.id,
            points: 1,
          },
        })
      }
    }
  }
}
