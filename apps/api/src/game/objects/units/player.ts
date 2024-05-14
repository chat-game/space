import { createId } from "@paralleldrive/cuid2"
import {
  type IGameObjectPlayer,
  type IGameSkill,
  type ItemType,
  getRandomInRange,
} from "../../../../../../packages/api-sdk/src"
import { db } from "../../../db/db.client"
import { Inventory, Skill } from "../../common"
import { Stone } from "../stone"
import { Tree } from "../tree"
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
  public userName = ""
  public lastActionAt: IGameObjectPlayer["lastActionAt"] = new Date()
  public health = 100

  public inventoryId?: string

  public skills: Skill[] = []

  constructor({ id, x, y }: IPlayerOptions) {
    const objectId = id ?? createId()

    super({ id: objectId, x, y, entity: "PLAYER" })

    this.speed = 2
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
    this.handleMessages()

    super.live()
    this.handleChange()

    if (this.state === "CHOPPING") {
      if (this.target instanceof Tree) {
        this.chopTree()
        this.upSkillWoodsman()
      }
      if (this.target?.state === "DESTROYED") {
        this.state = "IDLE"
        if (this.target instanceof Tree) {
          void this.inventory.addOrCreateItem("WOOD", this.target?.resource)
        }
      }
      return
    }

    if (this.state === "MINING") {
      if (this.target instanceof Stone) {
        // Skill up on random
        const random = getRandomInRange(1, 200)
        if (random <= 1) {
          const skill = this.skills.find((skill) => skill.type === "MINER")
          if (skill) {
            void skill.addXp()
          }
        }

        // Check instrument
        const pickaxe = this.inventory.items.find(
          (item) => item.type === "PICKAXE",
        )
        if (pickaxe) {
          this.target.health -= 0.16
          const random = getRandomInRange(1, 40)
          if (random <= 1) {
            void this.inventory.checkAndBreakItem(pickaxe, 1)
          }
        }

        this.target.mine()
        this.handleChange()

        if (this.target.health <= 0) {
          void this.stopMining(this.target)
        }
      }

      return
    }
  }

  handleChange() {
    const prepared = {
      ...this,
      script: undefined,
      live: undefined,
    }

    this.sendMessageObjectUpdated(prepared)
  }

  async startChopping() {
    this.state = "CHOPPING"
    this.direction = "RIGHT"

    await this.findOrCreateSkillInDB("WOODSMAN")

    await this.updateLastActionAt()
    this.handleChange()
  }

  async startMining() {
    this.state = "MINING"
    this.direction = "RIGHT"

    await this.findOrCreateSkillInDB("MINER")

    await this.updateLastActionAt()
    this.handleChange()
  }

  async stopMining(stone: Stone) {
    this.state = "IDLE"
    // Reward
    await this.inventory.addOrCreateItem("STONE", stone.resource)
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

  async buyItemFromDealer(type: ItemType, price: number, amount: number) {
    const item = await this.inventory.tryGetItemInDB(type)
    if (item) {
      return false
    }

    if (this.coins < price) {
      return false
    }

    await this.updateCoins(-price)
    await this.inventory.addOrCreateItem(type, amount)
    this.handleChange()

    return true
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

  public upSkillWoodsman() {
    const random = getRandomInRange(1, 200)
    if (random <= 1) {
      const skill = this.skills.find((skill) => skill.type === "WOODSMAN")
      if (skill) {
        void skill.addXp()
      }
    }
  }
}
