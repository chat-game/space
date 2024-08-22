import { createId } from '@paralleldrive/cuid2'
import type { QuestEdition } from '@prisma/client'
import type {
  CharacterEditionWithCharacter,
  Coupon,
  Profile,
  ProfileWithTokens,
  TwitchAccessToken,
  TwitchToken,
} from '@chat-game/types'
import { db } from '@chat-game/prisma-client'
import { getDateMinusMinutes } from './date'

export class DBRepository {
  createTwitchAccessToken(token: TwitchAccessToken) {
    return db.twitchAccessToken.create({
      data: {
        ...token,
        obtainmentTimestamp: token.obtainmentTimestamp.toString(),
      },
    })
  }

  async getTwitchAccessToken(userId: string): Promise<TwitchAccessToken | null> {
    const token = await db.twitchAccessToken.findFirst({
      where: { userId },
    })
    if (!token) {
      return null
    }

    return {
      ...token,
      obtainmentTimestamp: Number(token.obtainmentTimestamp),
    }
  }

  updateTwitchAccessToken(userId: string, token: Partial<TwitchAccessToken>) {
    return db.twitchAccessToken.updateMany({
      where: { userId },
      data: {
        ...token,
        obtainmentTimestamp: token.obtainmentTimestamp?.toString(),
      },
    })
  }

  async findAllStreamers(type: TwitchToken['type']): Promise<ProfileWithTokens[]> {
    return (await db.profile.findMany({
      where: { twitchTokens: { some: { status: 'ACTIVE', type } } },
      include: {
        twitchTokens: true,
      },
    })) as ProfileWithTokens[]
  }

  async getTokensCount(type: TwitchToken['type']) {
    return db.twitchToken.count({
      where: { status: 'ACTIVE', type },
    })
  }

  findProfile(id: string) {
    return db.profile.findUnique({ where: { id } })
  }

  findProfileByTwitchId(twitchId: string): Promise<Profile | null> {
    return db.profile.findFirst({ where: { twitchId } })
  }

  async findOrCreateProfile({ userId, userName }: { userId: string; userName: string }) {
    let profile = await db.profile.findFirst({
      where: { twitchId: userId },
    })
    if (!profile) {
      const editionId = createId()

      const newProfile = {
        id: createId(),
        twitchId: userId,
        userName,
        activeEditionId: editionId,
        mana: 10,
      }

      const createdProfile: Profile = await db.profile.create({
        data: newProfile,
      })

      // Twitchy
      const edition = await db.characterEdition.create({
        data: {
          id: editionId,
          profileId: createdProfile.id,
          characterId: 'staoqh419yy3k22cbtm9wquc',
        },
      })

      profile = await db.profile.update({
        where: { id: createdProfile.id },
        data: {
          activeEditionId: edition.id,
        },
      })
    }

    return profile
  }

  async findCharacterByEditionId(editionId: string): Promise<CharacterEditionWithCharacter> {
    const char = await db.characterEdition.findFirst({
      where: { id: editionId },
      include: {
        character: true,
      },
    })

    return char as CharacterEditionWithCharacter
  }

  async updateManaOnProfiles() {
    const profiles = await db.profile.findMany({
      where: {
        mana: {
          lt: 10,
        },
      },
    })

    for (const profile of profiles) {
      await db.profile.update({
        where: { id: profile.id },
        data: {
          mana: {
            increment: 2,
          },
        },
      })
    }
  }

  addXpToCharacterEdition(id: string) {
    return db.characterEdition.update({
      where: { id },
      data: {
        xp: {
          increment: 1,
        },
      },
    })
  }

  addLevelToCharacterEdition(id: string) {
    return db.characterEdition.update({
      where: { id },
      data: {
        level: {
          increment: 1,
        },
      },
    })
  }

  async addCoinsToProfile(id: string, editionId: string, increment = 1) {
    await db.transaction.create({
      data: {
        id: createId(),
        profileId: id,
        entityId: editionId,
        amount: increment,
        type: 'COIN_FROM_LVL_UP',
      },
    })

    return db.profile.update({
      where: { id },
      data: {
        coins: { increment },
      },
    })
  }

  async addCoinsToProfileFromQuest(id: string, questId: string, increment = 1) {
    await db.transaction.create({
      data: {
        id: createId(),
        profileId: id,
        entityId: questId,
        amount: increment,
        type: 'COINS_FROM_QUEST',
      },
    })

    return db.profile.update({
      where: { id },
      data: {
        coins: { increment },
      },
    })
  }

  async addTrophyToProfile(id: string, profileId: string) {
    const trophyEdition = await db.trophyEdition.findUnique({
      where: { id, profileId },
      include: { trophy: true },
    })
    if (trophyEdition?.id) {
      // Already added
      return
    }

    const newEdition = await db.trophyEdition.create({
      data: {
        id: createId(),
        profileId,
        trophyId: id,
      },
      include: { trophy: true },
    })

    return this.addTrophyHunterPoints(profileId, newEdition.trophy.points)
  }

  async addCollectorPoints(id: string, points: number) {
    await db.transaction.create({
      data: {
        id: createId(),
        profileId: id,
        entityId: id,
        amount: points,
        type: 'POINTS_FROM_LEVEL_UP',
      },
    })

    const profile = await db.profile.update({
      where: { id },
      data: {
        collectorPoints: {
          increment: points,
        },
      },
    })

    await this.recountProfilePoints(profile.id)

    return profile
  }

  async recountProfilePoints(id: string) {
    const profile = await db.profile.findUnique({ where: { id } })
    if (!profile) {
      return
    }

    const points =
      profile.collectorPoints +
      profile.trophyHunterPoints +
      profile.storytellerPoints +
      profile.patronPoints
    if (points !== profile.points) {
      await db.profile.update({
        where: { id },
        data: { points },
      })
    }

    if (this.checkIfNeedToLevelUpProfile(points, profile.level)) {
      await this.addLevelToProfile(id)
    }
  }

  addLevelToProfile(id: string) {
    return db.profile.update({
      where: { id },
      data: {
        level: { increment: 1 },
      },
    })
  }

  async addTrophyHunterPoints(id: string, points: number) {
    const profile = await db.profile.update({
      where: { id },
      data: {
        trophyHunterPoints: {
          increment: points,
        },
      },
    })

    await this.recountProfilePoints(profile.id)

    return profile
  }

  async addRangerPoints(id: string, points: number) {
    const profile = await db.profile.update({
      where: { id },
      data: {
        rangerPoints: { increment: points },
      },
    })

    await this.recountProfilePoints(profile.id)

    return profile
  }

  checkIfNeedToLevelUpProfile(xpNow: number, levelNow: number) {
    if (levelNow >= 50) {
      return false
    }

    const levelProgress = {
      1: 0,
      2: 25,
      3: 50,
      4: 100,
      5: 200,
      6: 400,
      7: 800,
      8: 1600,
      9: 3200,
      10: 6400,
      11: 9600,
      12: 14400,
      13: 21600,
      14: 32400,
      15: 48600,
      16: 72900,
      17: 110000,
      18: 165000,
      19: 247000,
      20: 370000,
      21: 444000,
      22: 532000,
      23: 638000,
      24: 765000,
      25: 918000,
      26: 1100000,
      27: 1320000,
      28: 1580000,
      29: 1890000,
      30: 2260000,
      31: 2480000,
      32: 2720000,
      33: 2990000,
      34: 3200000,
      35: 3500000,
      36: 3800000,
      37: 4100000,
      38: 4500000,
      39: 4900000,
      40: 5300000,
      41: 5800000,
      42: 6300000,
      43: 6900000,
      44: 7500000,
      45: 8200000,
      46: 9000000,
      47: 9900000,
      48: 11000000,
      49: 13000000,
      50: 15000000,
    }

    const key = (levelNow + 1) as keyof typeof levelProgress
    return xpNow >= levelProgress[key]
  }

  async findOrCreatePlayer({ userName, profileId }: { userName: string; profileId: string }) {
    let player = await db.player.findFirst({
      where: { profileId },
    })
    if (!player) {
      const playerId = createId()

      // Create new inventory
      const newInventory = {
        id: createId(),
        objectId: playerId,
      }
      const inventory = await db.inventory.create({
        data: newInventory,
      })

      // Create new one
      const newPlayer = {
        id: playerId,
        name: userName,
        inventoryId: inventory.id,
        profileId,
      }
      player = await db.player.create({
        data: newPlayer,
      })
    }

    return player
  }

  async findOrCreateWoodlandPlayer({
    name,
    profileId,
    woodlandId,
  }: {
    name: string
    profileId: string
    woodlandId: string
  }) {
    let player = await db.woodlandPlayer.findFirst({
      where: { profileId },
    })
    if (!player) {
      // Create new one
      player = await db.woodlandPlayer.create({
        data: {
          id: createId(),
          name,
          profileId,
          woodlandId,
        },
      })
    }

    return player
  }

  findActiveWoodland(tokenId: string) {
    return db.woodland.findFirst({
      where: { tokenId, status: { in: ['CREATED', 'STARTED'] } },
    })
  }

  async getPlaceInTopByCoupons(profileId: string) {
    const topProfiles = await db.profile.findMany({
      orderBy: { coupons: 'desc' },
      take: 1000,
    })

    return topProfiles.findIndex((profile) => profile.id === profileId) + 1
  }

  async generateCouponCommand(): Promise<string> {
    // Generate 2-digit number
    const number = Math.floor(Math.random() * 90 + 10)

    // Check if already have in 24 hours
    const gte = getDateMinusMinutes(60 * 24)

    const isAlreadyExist = await db.coupon.findFirst({
      where: { activationCommand: number.toString(), createdAt: { gte } },
    })
    if (isAlreadyExist) {
      return this.generateCouponCommand()
    }

    return number.toString()
  }

  async generateCoupon() {
    const activationCommand = await this.generateCouponCommand()

    const newCoupon: Omit<Coupon, 'createdAt' | 'updatedAt' | 'profileId'> = {
      id: createId(),
      activationCommand,
      status: 'CREATED',
    }

    return db.coupon.create({
      data: newCoupon,
    })
  }

  async activateCouponByCommand(
    id: string,
    profileId: string
  ): Promise<'OK' | 'TAKEN_ALREADY' | 'TIME_LIMIT' | 'NOT_FOUND'> {
    // Check, if this profile already take coupon in 10 hours
    const gte = getDateMinusMinutes(60 * 10)

    const isAlreadyToday = await db.coupon.findFirst({
      where: { profileId, createdAt: { gte } },
    })
    if (isAlreadyToday) {
      return 'TIME_LIMIT'
    }

    const coupon = await db.coupon.findFirst({
      where: { activationCommand: id, createdAt: { gte } },
    })
    if (!coupon) {
      return 'NOT_FOUND'
    }
    if (coupon.profileId) {
      return 'TAKEN_ALREADY'
    }

    await db.coupon.update({
      where: { id: coupon.id },
      data: {
        profileId,
        status: 'TAKEN',
      },
    })

    await db.profile.update({
      where: { id: profileId },
      data: {
        coupons: { increment: 1 },
      },
    })

    return 'OK'
  }

  async findProfileQuests(profileId: string) {
    return db.quest.findMany({
      include: {
        editions: {
          where: { profileId },
        },
        rewards: true,
      },
    })
  }

  async createQuestEdition(data: Omit<QuestEdition, 'createdAt' | 'updatedAt'>) {
    return db.questEdition.create({
      data,
    })
  }

  async updateQuestEdition(id: string, data: Pick<QuestEdition, 'completedAt' | 'status'>) {
    return db.questEdition.update({
      where: { id },
      data,
    })
  }
}
