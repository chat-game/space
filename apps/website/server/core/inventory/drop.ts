import { createId } from '@paralleldrive/cuid2'
import { getRandomInRange } from '~/utils/random'

export async function dropFromTree(telegramId: string) {
  const profile = await prisma.telegramProfile.findFirst({
    where: { telegramId },
    include: {
      profile: true,
    },
  })
  if (!profile?.profile) {
    return
  }

  // +xp to char
  if (profile.profile.activeEditionId) {
    await addXpToCharacterEdition(profile.profile.activeEditionId, getRandomInRange(1, 2))
  }

  const randomChance = getRandomInRange(0, 100)

  // Simple wood: 5% chance
  if (randomChance <= 5) {
    const simpleWoodId = 'rrrsnr31bmzus12abhupq06n'
    await addItemToInventory(profile.profile.id, simpleWoodId, 1)
    return
  }
  // Branch: 8% chance
  if (randomChance <= 5 + 8) {
    const branchId = 'rq8hovyeqg4bh2siw9flcerf'
    await addItemToInventory(profile.profile.id, branchId, 1)
  }
}

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
      await addItemToInventory(telegramProfile.profile.id, itemId, 1)

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

async function addItemToInventory(profileId: string, itemId: string, amount: number) {
  const item = await prisma.inventoryItemEdition.findFirst({
    where: { profileId, itemId },
  })
  if (item) {
    await prisma.inventoryItemEdition.update({
      where: { id: item?.id },
      data: {
        amount: {
          increment: amount,
        },
      },
    })
  } else {
    await prisma.inventoryItemEdition.create({
      data: {
        id: createId(),
        itemId,
        profileId,
        amount,
      },
    })
  }
}

async function addXpToCharacterEdition(activeEditionId: string, amount: number) {
  const edition = await prisma.characterEdition.findFirst({
    where: { id: activeEditionId },
  })
  if (!edition) {
    return
  }

  const maxLevel = await prisma.characterLevel.findFirst({
    where: { characterId: edition?.characterId },
    orderBy: {
      level: 'desc',
    },
  })
  if (maxLevel?.level && edition?.level >= maxLevel.level) {
    return
  }

  const nextLevel = await prisma.characterLevel.findFirst({
    where: { characterId: edition?.characterId, level: edition.level + 1 },
  })
  if (!nextLevel || nextLevel.requiredXp <= edition.xp) {
    return
  }

  const updated = await prisma.characterEdition.update({
    where: { id: edition.id },
    data: {
      xp: {
        increment: amount,
      },
    },
  })

  // Level up?
  if (updated.xp >= nextLevel.requiredXp) {
    await prisma.characterEdition.update({
      where: { id: edition.id },
      data: {
        level: {
          increment: 1,
        },
      },
    })

    // Reward
    if (nextLevel.inventoryItemId && nextLevel.awardAmount > 0) {
      await addItemToInventory(edition.profileId, nextLevel.inventoryItemId, nextLevel.awardAmount)
    }
  }
}
