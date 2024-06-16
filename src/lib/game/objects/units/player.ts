import { Inventory, Skill } from '../../common'
import { UnitObject } from './unitObject'
import { getRandomInRange } from '$lib/random'
import type { GameScene, IGameObjectPlayer, IGameSkill } from '$lib/game/types'

interface PlayerOptions {
  scene: GameScene
  id?: string
  x: number
  y: number
}

export class Player extends UnitObject implements IGameObjectPlayer {
  reputation!: number
  villainPoints!: number
  refuellerPoints!: number
  raiderPoints!: number
  skills!: Skill[]
  lastActionAt!: IGameObjectPlayer['lastActionAt']

  public inventoryId?: string

  constructor({ scene, id, x, y }: PlayerOptions) {
    super({ scene, id, x, y, type: 'PLAYER' })

    this.speedPerSecond = 2
    void this.initFromDB()
  }

  async initFromDB() {
    await this.readFromDB()
    await this.initSkillsFromDB()
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

  updateCoins(amount: number) {
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

  addRefuellerPoints(amount: number) {
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

  addVillainPoints(amount: number) {
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

  addRaiderPoints(amount: number) {
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

  public async readFromDB() {
    // const player = await db.player.findUnique({ where: { id: this.id } })
    // if (!player) {
    //   return
    // }
    //
    // this.userName = player.userName
    // this.coins = player.coins
    // this.reputation = player.reputation
    // this.villainPoints = player.villainPoints
    // this.refuellerPoints = player.refuellerPoints
    // this.raiderPoints = player.raiderPoints
    // this.inventoryId = player.inventoryId
  }

  public updateLastActionAt() {
    this.lastActionAt = new Date()
    // return db.player.update({
    //   where: { id: this.id },
    //   data: {
    //     lastActionAt: new Date(),
    //   },
    // })
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

  async findOrCreateSkillInDB(type: IGameSkill['type']) {
    const skill = this.skills.find((skill) => skill.type === type)
    if (!skill) {
      await Skill.createInDB(this.id, type)
      await this.initSkillsFromDB()
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
