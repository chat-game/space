import { UnitObject } from './unitObject'
import { getRandomInRange } from '$lib/utils/random'
import type {
  Game,
  GameObjectPlayer,
  IGameSkill,
} from '$lib/game/types'
import { Skill } from '$lib/game/common/skill'
import { Inventory } from '$lib/game/common/inventory'

interface PlayerOptions {
  game: Game
  id: string
  x: number
  y: number
}

export class Player extends UnitObject implements GameObjectPlayer {
  reputation!: number
  villainPoints!: number
  refuellerPoints!: number
  raiderPoints!: number
  skills!: Skill[]
  lastActionAt: GameObjectPlayer['lastActionAt']

  public inventoryId?: string

  constructor({ game, id, x, y }: PlayerOptions) {
    super({ game, id, x, y, type: 'PLAYER' })

    this.speedPerSecond = 70
    this.lastActionAt = new Date()
  }

  async init() {
    await this.#readFromDB()
    // await this.#initSkillsFromDB()
    // await this.#initInventoryFromDB()

    super.initVisual({
      head: '1',
      hairstyle: 'CLASSIC',
      top: 'VIOLET_SHIRT',
    })
  }

  async chopTree() {
    super.chopTree()

    await this.findOrCreateSkillInDB('WOODSMAN')
    this.upSkill('WOODSMAN')
  }

  async mineStone() {
    super.mineStone()

    await this.findOrCreateSkillInDB('MINER')
    this.upSkill('MINER')
  }

  updateCoins(amount: number): void {
    this.coins = this.coins + amount

    // return db.player.update({
    //   where: { id: this.id },
    //   data: {
    //     coins: this.coins,
    //   },
    // })
  }

  addReputation(amount: number) {
    this.reputation += amount

    // return db.player.update({
    //   where: { id: this.id },
    //   data: {
    //     reputation: this.reputation,
    //   },
    // })
  }

  addRefuellerPoints(amount: number): void {
    if (amount < 0) {
      return
    }

    this.refuellerPoints += amount

    // return db.player.update({
    //   where: { id: this.id },
    //   data: {
    //     refuellerPoints: this.refuellerPoints,
    //   },
    // })
  }

  addVillainPoints(amount: number): void {
    this.villainPoints += amount

    // return db.player.update({
    //   where: { id: this.id },
    //   data: {
    //     villainPoints: {
    //       increment: amount,
    //     },
    //   },
    // })
  }

  addRaiderPoints(amount: number): void {
    this.raiderPoints += amount

    // return db.player.update({
    //   where: { id: this.id },
    //   data: {
    //     raiderPoints: {
    //       increment: amount,
    //     },
    //   },
    // })
  }

  async #readFromDB() {
    // const res = await fetch(`/mock/game/player/${this.id}`)
    // const player = await res.json()
    // if (!player) {
    //   return
    // }

    // this.name = player.name
    // this.coins = player.coins
    // this.reputation = player.reputation
    // this.villainPoints = player.villainPoints
    // this.refuellerPoints = player.refuellerPoints
    // this.raiderPoints = player.raiderPoints
    // this.inventoryId = player.inventoryId
  }

  updateLastActionAt(): void {
    this.lastActionAt = new Date()
    // return db.player.update({
    //   where: { id: this.id },
    //   data: {
    //     lastActionAt: new Date(),
    //   },
    // })
  }

  async #initInventoryFromDB() {
    if (!this.inventoryId) {
      return
    }

    const inventory = new Inventory({
      objectId: this.id,
      saveInDb: true,
    })
    await inventory.init(this.inventoryId)

    this.inventory = inventory
  }

  async #initSkillsFromDB() {
    this.skills = []
    await Skill.findAllInDB(this.id)
    // for (const skill of skills) {
    //   const instance = new Skill({ id: skill.id })
    //   await instance.init()
    //   this.skills.push(instance)
    // }
  }

  async findOrCreateSkillInDB(type: IGameSkill['type']) {
    const skill = this.skills.find((skill) => skill.type === type)
    if (!skill) {
      await Skill.createInDB(this.id, type)
      await this.#initSkillsFromDB()
      return this.skills.find((skill) => skill.type === type) as Skill
    }

    return skill
  }

  public upSkill(type: IGameSkill['type']) {
    const random = getRandomInRange(1, 200)
    if (random <= 1) {
      const skill = this.skills.find((skill) => skill.type === type)
      if (skill) {
        void skill.addXp()
      }
    }
  }
}
