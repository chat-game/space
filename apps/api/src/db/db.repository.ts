import { createId } from "@paralleldrive/cuid2"
import { getRandomInRange } from "../../../../packages/api-sdk/src"
import { db } from "./db.client"

export class DBRepository {
  private readonly db

  constructor() {
    this.db = db
  }

  findVillage() {
    return db.village.findFirst()
  }

  findActivePlayers() {
    const milliseconds = 20 * 60 * 1000
    const gte = new Date(new Date().getTime() - milliseconds)

    return this.db.player.findMany({
      where: {
        lastActionAt: { gte },
      },
    })
  }

  async findTopPlayers() {
    const famous = await db.player.findFirst({
      orderBy: { reputation: "desc" },
    })
    const rich = await db.player.findFirst({
      orderBy: { coins: "desc" },
    })
    const viewer = await db.player.findFirst({
      orderBy: { viewerPoints: "desc" },
    })
    const villain = await db.player.findFirst({
      orderBy: { villainPoints: "desc" },
    })
    const refueller = await db.player.findFirst({
      orderBy: { refuellerPoints: "desc" },
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
      where: { type: "WOODSMAN" },
      orderBy: { lvl: "desc" },
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
      where: { type: "MINER" },
      orderBy: { lvl: "desc" },
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

  findPlayerByTwitchId(twitchId: string) {
    return this.db.player.findFirst({
      where: { twitchId },
    })
  }

  createPlayer({
    twitchId,
    userName,
    inventoryId,
    id,
  }: {
    twitchId: string
    userName: string
    inventoryId: string
    id: string
  }) {
    const colorIndex = getRandomInRange(0, 360)
    return db.player.create({
      data: {
        id,
        twitchId,
        userName,
        x: -100,
        y: 600,
        colorIndex,
        inventoryId,
      },
    })
  }

  async findOrCreatePlayer(twitchId: string, userName: string) {
    const player = await this.findPlayerByTwitchId(twitchId)
    if (!player) {
      const id = createId()
      const inventory = await this.createInventory(id)
      return this.createPlayer({
        id,
        twitchId,
        userName,
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

  addWoodToVillage(increment: number) {
    return db.village.updateMany({
      data: {
        wood: { increment },
      },
    })
  }

  async addStoneToVillage(amount: number) {
    await db.village.updateMany({
      data: {
        stone: {
          increment: amount,
        },
      },
    })

    // Global target
    const village = await this.findVillage()
    if (village?.globalTargetSuccess && village?.globalTarget) {
      const plusToTarget =
        village.globalTargetSuccess >= village.globalTarget + amount
          ? amount
          : 0

      await db.village.updateMany({
        data: {
          globalTarget: {
            increment: plusToTarget,
          },
        },
      })
    }
  }
}
