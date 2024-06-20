import { createId } from '@paralleldrive/cuid2'
import { getMinusOrPlus, getRandomInRange } from '$lib/utils/random'
import type { Game } from '$lib/game/types'
import { FlagObject } from '$lib/game/objects/flagObject'
import { BaseWagon } from '$lib/game/objects/baseWagon'
import { Inventory } from '$lib/game/common/inventory'
import type { GameWagonService } from '$lib/game/services/wagon/interface'

export class WagonService implements GameWagonService {
  wagon!: BaseWagon
  cargo: Inventory | undefined
  game: Game

  #outFlags: FlagObject[] = []
  #nearFlags: FlagObject[] = []

  constructor(game: Game) {
    this.game = game
  }

  update() {
    this.#updateWagon()
    this.#updateFlags()
  }

  initWagon({ x, y }: { x: number, y: number }) {
    this.wagon = new BaseWagon({ game: this.game, x, y })
    this.wagon.init()

    this.#initOutFlags()
    this.#initNearFlags()
  }

  get randomOutFlag() {
    return this.#outFlags[Math.floor(Math.random() * this.#outFlags.length)]
  }

  get randomNearFlag() {
    return this.#nearFlags[Math.floor(Math.random() * this.#nearFlags.length)]
  }

  setCargo() {
    this.cargo = new Inventory({
      id: createId(),
      saveInDb: false,
      objectId: this.wagon.id,
    })
    void this.cargo.addOrCreateItem('WOOD', 100)
    this.wagon.cargoType = 'CHEST'
  }

  emptyCargo() {
    this.cargo = undefined
    this.wagon.cargoType = undefined
  }

  #updateWagon() {
    const collisionObjects
      = this.game.children.filter(
        (obj) => obj.isOnWagonPath && obj.state !== 'DESTROYED',
      ) ?? []
    for (const collisionObject of collisionObjects) {
      const isInArea = this.wagon.checkIfPointInCollisionArea({
        x: collisionObject.x,
        y: collisionObject.y,
      })
      if (isInArea) {
        this.wagon.state = 'WAITING'
        this.wagon.speedPerSecond = 0
        return
      }
    }

    if (this.wagon.fuel <= 1) {
      this.wagon.state = 'WAITING'
      this.wagon.speedPerSecond = 0
      return
    }

    if (this.wagon.state === 'WAITING') {
      this.wagon.state = 'IDLE'
    }
    if (this.wagon.state === 'IDLE') {
      const target = this.game.routeService.nextFlag
      if (target) {
        this.wagon.target = target
        this.wagon.state = 'MOVING'
      }
    }
    if (this.wagon.state === 'MOVING') {
      this.wagon.speedPerSecond = 0.5
      const isMoving = this.wagon.move()

      if (!isMoving) {
        if (this.wagon.target?.type === 'FLAG') {
          this.game.routeService.route?.removeFlag(this.wagon.target.id)
          this.wagon.target = undefined
          this.wagon.state = 'IDLE'
          this.wagon.speedPerSecond = 0
        }
      }
    }

    this.wagon.live()
  }

  #updateFlags() {
    for (const flag of this.#nearFlags) {
      flag.x = this.wagon.x + flag.offsetX
      flag.y = this.wagon.y + flag.offsetY
    }
    for (const flag of this.#outFlags) {
      flag.x = this.wagon.x + flag.offsetX
      flag.y = this.wagon.y + flag.offsetY
    }
  }

  #initOutFlags(count = 20) {
    for (let i = 0; i < count; i++) {
      this.#outFlags.push(this.#generateRandomOutFlag())
    }
  }

  #initNearFlags(count = 20) {
    for (let i = 0; i < count; i++) {
      this.#nearFlags.push(this.#generateRandomNearFlag())
    }
  }

  #generateRandomOutFlag() {
    const minOffsetX = 1800
    const minOffsetY = 1200

    const offsetX
      = getRandomInRange(minOffsetX, minOffsetX * 1.5) * getMinusOrPlus()
    const offsetY
      = getRandomInRange(minOffsetY, minOffsetY * 1.5) * getMinusOrPlus()

    return new FlagObject({
      game: this.game,
      variant: 'OUT_OF_SCREEN',
      x: this.wagon.x + offsetX,
      y: this.wagon.y + offsetY,
      offsetX,
      offsetY,
    })
  }

  #generateRandomNearFlag() {
    const minRadius = 280
    const maxRadius = minRadius * 1.1

    const angle = Math.random() * Math.PI * 2
    const radius = getRandomInRange(minRadius, maxRadius)

    const offsetX = Math.round(Math.cos(angle) * radius)
    const offsetY = Math.round(Math.sin(angle) * radius)

    return new FlagObject({
      game: this.game,
      variant: 'WAGON_NEAR_MOVEMENT',
      x: this.wagon.x + offsetX,
      y: this.wagon.y + offsetY,
      offsetX,
      offsetY,
    })
  }
}
