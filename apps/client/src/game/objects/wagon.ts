import { Sprite } from "pixi.js"
import type { IGameObjectWagon } from "../../../../../packages/api-sdk/src"
import type { GraphicsContainer } from "../components/graphicsContainer"
import { WagonCargoContainer } from "../components/wagonCargoContainer"
import { WagonEngineCloudsContainer } from "../components/wagonEngineCloudsContainer"
import { WagonEngineContainer } from "../components/wagonEngineContainer"
import { WagonFuelBoxContainer } from "../components/wagonFuelBoxContainer"
import { WagonWheelContainer } from "../components/wagonWheelContainer"
import type { Game } from "../game"
import { GameObjectContainer } from "./gameObjectContainer"

interface IWagonOptions {
  game: Game
  object: IGameObjectWagon
}

export class Wagon extends GameObjectContainer implements IGameObjectWagon {
  public fuel!: number
  public visibilityArea!: IGameObjectWagon["visibilityArea"]
  public cargoType: IGameObjectWagon["cargoType"]

  public children: GraphicsContainer[] = []

  constructor({ game, object }: IWagonOptions) {
    super({ game, ...object })

    this.update(object)
    this.init()
  }

  init() {
    const spriteSide = Sprite.from("wagonBase1")
    spriteSide.anchor.set(0.5, 1)
    spriteSide.scale = 0.75

    const spriteBase = Sprite.from("wagonBase2")
    spriteBase.anchor.set(0.5, 1)
    spriteBase.scale = 0.75

    const cargo = WagonCargoContainer.create()
    cargo.scale = 0.75

    const engine = WagonEngineContainer.create("wagonEngine1", "RIGHT")
    engine.scale = 0.75

    const storage = WagonFuelBoxContainer.create()
    storage.scale = 0.75

    const wheel1 = WagonWheelContainer.create("wagonWheel1", "RIGHT", "LEFT")
    const wheel2 = WagonWheelContainer.create("wagonWheel1", "RIGHT", "RIGHT")
    wheel1.scale = 0.75
    wheel2.scale = 0.75

    const clouds = new WagonEngineCloudsContainer()

    this.addChild(
      spriteBase,
      engine,
      cargo,
      spriteSide,
      storage,
      wheel1,
      wheel2,
      clouds,
    )
  }

  animate() {
    for (const container of this.children) {
      container.visible = true

      this.drawWheels(container)
      this.drawEngine(container)
      this.drawCargo(container)
      this.drawFuel(container)

      if (container instanceof WagonEngineCloudsContainer) {
        container.animate(this.speed)
      }
    }

    this.handleSoundByState()
  }

  drawWheels(container: GraphicsContainer) {
    if (container instanceof WagonWheelContainer) {
      if (container.side === "LEFT") {
        container.x = -123
        container.y = -16
      }
      if (container.side === "RIGHT") {
        container.x = 123
        container.y = -16
      }

      container.visible = true

      const wheelRotation = this.direction === "LEFT" ? -1 : 1

      container.angle += (wheelRotation * this.speed) / 2.5
    }
  }

  drawEngine(container: GraphicsContainer) {
    if (container instanceof WagonEngineContainer) {
      container.x = -102
      container.y = -58

      container.visible = true
    }
  }

  drawCargo(container: GraphicsContainer) {
    if (container instanceof WagonCargoContainer) {
      if (this.cargoType === "CHEST") {
        container.visible = true
        for (const c of container.children) {
          c.visible = true
        }
      }

      if (!this.cargoType) {
        container.visible = false
      }
    }
  }

  drawFuel(container: GraphicsContainer) {
    let initFuel = this.fuel
    if (container instanceof WagonFuelBoxContainer) {
      for (const c of container.children) {
        for (const fuelSprite of c.children) {
          fuelSprite.visible = false
          initFuel -= 500

          if (initFuel > 500) {
            fuelSprite.visible = true
          }
        }
      }
    }
  }

  handleSoundByState() {
    if (this.state === "MOVING") {
      this.game.audio.playWagonMovingSound()
    }
  }

  update(object: IGameObjectWagon) {
    super.update(object)

    this.speed = object.speed
    this.fuel = object.fuel
    this.cargoType = object.cargoType
  }
}
