import { createId } from '@paralleldrive/cuid2'
import type { TwitchAccessToken } from '../../../../packages/api-sdk/src'
import { db } from './db.client'

export class DBRepository {
  private readonly db

  constructor() {
    this.db = db
  }

  async getTwitchAccessToken(
    userId: string,
  ): Promise<TwitchAccessToken | null> {
    const token = await db.twitchAccessToken.findUnique({
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
    return db.twitchAccessToken.update({
      where: { userId },
      data: {
        ...token,
        obtainmentTimestamp: token.obtainmentTimestamp?.toString(),
      },
    })
  }

  createTwitchAccessToken(token: TwitchAccessToken) {
    return db.twitchAccessToken.create({
      data: {
        ...token,
        obtainmentTimestamp: token.obtainmentTimestamp.toString(),
      },
    })
  }

  findVillage() {
    return db.village.findFirst()
  }

  async findTopPlayers() {
    const famous = await db.player.findFirst({
      orderBy: { reputation: 'desc' },
    })
    const rich = await db.player.findFirst({
      orderBy: { coins: 'desc' },
    })
    const viewer = await db.player.findFirst({
      orderBy: { viewerPoints: 'desc' },
    })
    const raider = await db.player.findFirst({
      orderBy: { raiderPoints: 'desc' },
    })
    const villain = await db.player.findFirst({
      orderBy: { villainPoints: 'desc' },
    })
    const refueller = await db.player.findFirst({
      orderBy: { refuellerPoints: 'desc' },
    })
    const woodsman = await this.findTopWoodsmanPlayer()
    const miner = await this.findTopMinerPlayer()

    return {
      famous: {
        player: famous,
        points: famous?.reputation,
      },
      rich: {
        player: rich,
        points: rich?.coins,
      },
      viewer: {
        player: viewer,
        points: viewer?.viewerPoints,
      },
      raider: {
        player: raider,
        points: raider?.raiderPoints,
      },
      villain: {
        player: villain,
        points: villain?.villainPoints,
      },
      refueller: {
        player: refueller,
        points: refueller?.refuellerPoints,
      },
      woodsman,
      miner,
    }
  }

  async findTopWoodsmanPlayer() {
    const topSkill = await db.skill.findFirst({
      where: { type: 'WOODSMAN' },
      orderBy: { lvl: 'desc' },
    })
    if (!topSkill) {
      return null
    }
    const player = await db.player.findUnique({
      where: { id: topSkill.objectId },
    })

    return {
      player,
      points: topSkill.lvl,
    }
  }

  async findTopMinerPlayer() {
    const topSkill = await db.skill.findFirst({
      where: { type: 'MINER' },
      orderBy: { lvl: 'desc' },
    })
    if (!topSkill) {
      return null
    }
    const player = await db.player.findUnique({
      where: { id: topSkill.objectId },
    })

    return {
      player,
      points: topSkill.lvl,
    }
  }

  findPlayerByProfileId(profileId: string) {
    return this.db.player.findFirst({
      where: { profileId },
    })
  }

  createPlayer({
    profileId,
    name,
    inventoryId,
    id,
  }: {
    profileId: string
    name: string
    inventoryId: string
    id: string
  }) {
    return db.player.create({
      data: {
        id,
        profileId,
        name,
        inventoryId,
      },
    })
  }

  async findOrCreatePlayer(profileId: string, name: string) {
    const player = await this.findPlayerByProfileId(profileId)
    if (!player) {
      const id = createId()
      const inventory = await this.createInventory(id)
      return this.createPlayer({
        id,
        profileId,
        name,
        inventoryId: inventory.id,
      })
    }

    return player
  }

  createInventory(objectId: string) {
    return db.inventory.create({
      data: {
        id: createId(),
        objectId,
      },
    })
  }

  addPlayerViewerPoints(id: string, increment: number) {
    return db.player.update({
      where: { id },
      data: {
        viewerPoints: { increment },
      },
    })
  }

  findAllChatCommands() {
    return db.chatCommand.findMany()
  }
}
