import { type AnimatedSprite, Sprite } from "pixi.js";
import type { IGameBuildingCampfire } from "../../../../../../packages/api-sdk/src";
import { FireParticlesContainer } from "../../components/fireParticlesContainer";
import type { Game } from "../../game";
import { AssetsManager } from "../../utils";
import { Building } from "./building";

interface ICampfireOptions {
  game: Game;
  object: IGameBuildingCampfire;
}

export class Campfire extends Building implements IGameBuildingCampfire {
  private fireAnimation!: AnimatedSprite;
  private fireParticles!: FireParticlesContainer;

  constructor({ game, object }: ICampfireOptions) {
    super({ game, object });

    this.init();
  }

  init() {
    const sprite = Sprite.from("campfire1");
    sprite.anchor.set(0.5, 1);

    this.fireAnimation = AssetsManager.getAnimatedSpriteCampfire();
    this.fireParticles = new FireParticlesContainer({
      x: 0,
      y: -40,
      areaWidth: 40,
    });

    this.addChild(sprite, this.fireAnimation, this.fireParticles);
  }

  animate() {
    super.animate();

    this.fireAnimation.animationSpeed = 0.08;
    this.fireAnimation.play();

    this.fireParticles.animate(1);

    this.handleSoundByState();
  }

  handleSoundByState() {
    if (!this.isVisibleOnClient) {
      return;
    }

    if (this.state === "IDLE") {
      this.game.audio.playCampfireSound();
    }
  }
}
