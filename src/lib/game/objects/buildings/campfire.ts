import { type AnimatedSprite, Sprite } from "pixi.js"
import type { IGameBuildingCampfire } from "$lib/game/types"
import { FireParticlesContainer } from "../../components/fireParticlesContainer"
import type { GameScene } from "../../scenes/gameScene.ts"
import { AssetsManager } from "../../utils"
import { Building } from "./building"

interface ICampfireOptions {
  scene: GameScene
  x: number
  y: number
}

export class Campfire extends Building implements IGameBuildingCampfire {
  private fireAnimation!: AnimatedSprite
  private fireParticles!: FireParticlesContainer

  constructor({ scene, x, y }: ICampfireOptions) {
    super({ scene, x, y })

    this.initGraphics()
  }

  public animate() {
    super.animate()

    this.fireAnimation.animationSpeed = 0.08
    this.fireAnimation.play()

    this.fireParticles.animate(1)

    this.handleSoundByState()
  }

  private initGraphics() {
    const sprite = Sprite.from("campfire1")
    sprite.anchor.set(0.5, 1)

    this.fireAnimation = AssetsManager.getAnimatedSpriteCampfire()
    this.fireParticles = new FireParticlesContainer({
      x: 0,
      y: -40,
      areaWidth: 40,
    })

    this.addChild(sprite, this.fireAnimation, this.fireParticles)
  }

  private handleSoundByState() {
    if (!this.visible) {
      return
    }

    if (this.state === "IDLE") {
      this.scene.game.audio.playSound("FIRE_BURN")
    }
  }
}
