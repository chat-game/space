import { createId } from "@paralleldrive/cuid2"
import {
  type IGameObjectTree,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src"
import { GameObject } from "./gameObject"

interface ITreeOptions {
  id?: string
  x: number
  y: number
  resource?: number
  size?: number
  health?: number
  growSpeed?: number
  type?: IGameObjectTree["type"]
  variant?: IGameObjectTree["variant"]
}

export class Tree extends GameObject implements IGameObjectTree {
  public type: IGameObjectTree["type"] = "1"
  public variant: IGameObjectTree["variant"] = "GREEN"
  public resource = 0
  public size
  public minSizeToChop = 75
  public maxSize = 100
  public growSpeed
  public health
  public isReadyToChop = false
  public isReserved = false

  constructor({
    id,
    x,
    y,
    resource,
    size,
    health,
    growSpeed,
    variant,
    type,
  }: ITreeOptions) {
    const objectId = id ?? createId()

    super({ id: objectId, x, y, entity: "TREE" })

    this.state = "IDLE"
    this.resource = resource ?? getRandomInRange(1, 5)
    this.size = size ?? 100
    this.health = health ?? 100
    this.growSpeed = growSpeed ?? 0.01
    this.type = type ?? this.getNewType()
    this.variant = variant ?? this.getNewVariant()
  }

  live() {
    this.checkHealth()

    switch (this.state) {
      case "IDLE":
        this.handleIdleState()
        break
      case "CHOPPING":
        this.handleChoppingState()
        break
      case "DESTROYED":
        break
    }
  }

  checkHealth() {
    if (this.health <= 0) {
      this.destroy()
    }
  }

  handleChange() {
    this.sendMessageObjectUpdated()
  }

  handleIdleState() {
    this.grow()

    const random = getRandomInRange(1, 60)
    if (random <= 1) {
      this.handleChange()
    }
  }

  handleChoppingState() {
    const random = getRandomInRange(1, 20)
    if (random <= 1) {
      this.state = "IDLE"
      this.isReserved = false
    }
  }

  grow() {
    if (this.size >= this.minSizeToChop && !this.isReadyToChop) {
      this.isReadyToChop = true
    }
    if (this.size >= this.maxSize) {
      return
    }

    this.size += this.growSpeed
    this.handleChange()
  }

  public chop() {
    this.state = "CHOPPING"
    this.isReserved = true
    this.health -= 0.08
    this.handleChange()
  }

  destroy() {
    this.size = 0
    this.health = 0
    this.state = "DESTROYED"
    this.handleChange()
  }

  getNewType(): IGameObjectTree["type"] {
    const types: IGameObjectTree["type"][] = ["1", "2", "3", "4", "5"]
    const index = getRandomInRange(0, types.length - 1)
    return types[index]
  }

  getNewVariant(): IGameObjectTree["variant"] {
    const variants: IGameObjectTree["variant"][] = [
      "GREEN",
      "BLUE",
      "STONE",
      "TEAL",
      "TOXIC",
      "VIOLET",
    ]
    const index = getRandomInRange(0, variants.length - 1)
    return variants[index]
  }
}
