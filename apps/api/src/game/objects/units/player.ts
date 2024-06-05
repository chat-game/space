import { createId } from "@paralleldrive/cuid2"
import {
  type IGameObjectPlayer,
  type IGameSkill,
  getRandomInRange,
} from "../../../../../../packages/api-sdk/src"
import { db } from "../../../db/db.client"
import { Inventory, Skill } from "../../common"
import { Unit } from "./unit"

interface IPlayerOptions {
  id?: string
  x: number
  y: number
}

export class Player extends Unit implements IGameObjectPlayer {
  public coins = 0
  public reputation = 0
  public villainPoints = 0
  public refuellerPoints = 0
  public raiderPoints = 0
  public lastActionAt: IGameObjectPlayer["lastActionAt"] = new Date()
  public health = 100

  public inventoryId?: string

  public skills: Skill[] = []

  constructor({ id, x, y }: IPlayerOptions) {
    const objectId = id ?? createId()

    super({ id: objectId, x, y, entity: "PLAYER" })

    this.speedPerSecond = 2
  }

  async init() {
    await this.readFromDB()
    await this.initSkillsFromDB()
    super.initVisual({
      head: "1",
      hairstyle: "CLASSIC",
      top: "VIOLET_SHIRT",
    })
  }

  live() {
    super.live()
    this.handleChange()
  }

  handleChange() {
    const prepared = {
      ...this,
      script: undefined,
      live: undefined,
    }

    this.sendMessageObjectUpdated(prepared)
  }

  async chopTree() {
    super.chopTree()

    await this.findOrCreateSkillInDB("WOODSMAN")
    this.upSkill("WOODSMAN")
    this.handleChange()
  }

  async mineStone() {
    super.mineStone()

    await this.findOrCreateSkillInDB("MINER")
    this.upSkill("MINER")
    this.handleChange()
  }

  updateCoins(amount: number) {
    this.coins = this.coins + amount
    this.handleChange()

    return db.player.update({
      where: { id: this.id },
      data: {
        coins: this.coins,
      },
    })
  }

  addReputation(amount: number) {
    this.reputation += amount
    this.handleChange()

    return db.player.update({
      where: { id: this.id },
      data: {
        reputation: this.reputation,
      },
    })
  }

  addRefuellerPoints(amount: number) {
    if (amount < 0) {
      return
    }

    this.refuellerPoints += amount
    this.handleChange()

    return db.player.update({
      where: { id: this.id },
      data: {
        refuellerPoints: this.refuellerPoints,
      },
    })
  }

  addVillainPoints(amount: number) {
    this.villainPoints += amount
    this.handleChange()

    return db.player.update({
      where: { id: this.id },
      data: {
        villainPoints: {
          increment: amount,
        },
      },
    })
  }

  addRaiderPoints(amount: number) {
    this.raiderPoints += amount
    this.handleChange()

    return db.player.update({
      where: { id: this.id },
      data: {
        raiderPoints: {
          increment: amount,
        },
      },
    })
  }

  public async readFromDB() {
    const player = await db.player.findUnique({ where: { id: this.id } })
    if (!player) {
      return
    }

    this.userName = player.userName
    this.coins = player.coins
    this.reputation = player.reputation
    this.villainPoints = player.villainPoints
    this.refuellerPoints = player.refuellerPoints
    this.raiderPoints = player.raiderPoints
    this.inventoryId = player.inventoryId
  }

  public updateLastActionAt() {
    this.lastActionAt = new Date()
    return db.player.update({
      where: { id: this.id },
      data: {
        lastActionAt: new Date(),
      },
    })
  }

  public async initInventoryFromDB() {
    if (!this.inventoryId) {
      return
    }

    const inventory = new Inventory({
      objectId: this.id,
      id: this.inventoryId,
      saveInDb: true,
    })
    await inventory.init()
    this.inventory = inventory
  }

  public async initSkillsFromDB() {
    this.skills = []
    const skills = await Skill.findAllInDB(this.id)
    for (const skill of skills) {
      const instance = new Skill({ id: skill.id })
      await instance.init()
      this.skills.push(instance)
    }
  }

  async findOrCreateSkillInDB(type: IGameSkill["type"]) {
    const skill = this.skills.find((skill) => skill.type === type)
    if (!skill) {
      await Skill.createInDB(this.id, type)
      await this.initSkillsFromDB()
      return this.skills.find((skill) => skill.type === type) as Skill
    }

    return skill
  }

  public upSkill(type: IGameSkill["type"]) {
    const random = getRandomInRange(1, 200)
    if (random <= 1) {
      const skill = this.skills.find((skill) => skill.type === type)
      if (skill) {
        void skill.addXp()
      }
    }
  }
}
