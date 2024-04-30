import type { AnimatedSprite } from "pixi.js";
import type {
  IGameInventory,
  IGameObjectUnit,
} from "../../../../../../packages/api-sdk/src";
import type { GraphicsContainer } from "../../components/graphicsContainer";
import { UnitHairContainer } from "../../components/unitHairContainer";
import { UnitHeadContainer } from "../../components/unitHeadContainer";
import { UnitInterface } from "../../components/unitInterface";
import { UnitTopContainer } from "../../components/unitTopContainer";
import type { Game } from "../../game";
import { AssetsManager } from "../../utils";
import { Flag } from "../flag";
import { GameObjectContainer } from "../gameObjectContainer";

interface IUnitOptions {
  game: Game;
  object: IGameObjectUnit;
}

export class Unit extends GameObjectContainer implements IGameObjectUnit {
  public inventory!: IGameInventory;
  public visual!: IGameObjectUnit["visual"];
  public coins = 0;

  public interface!: UnitInterface;
  public children: GraphicsContainer[] = [];
  animationMovingLeft!: AnimatedSprite;
  animationMovingRight!: AnimatedSprite;

  constructor({ game, object }: IUnitOptions) {
    super({ game, ...object });
    this.update(object);

    this.animationMovingLeft = AssetsManager.getAnimatedSpriteHeroLeft();
    this.animationMovingRight = AssetsManager.getAnimatedSpriteHeroRight();

    this.init();
  }

  init() {
    const top = this.initTop();
    const head = this.initHead();
    const hair = this.initHair();

    this.initInterface();

    this.addChild(
      ...top,
      ...head,
      ...hair,
      this.animationMovingLeft,
      this.animationMovingRight,
      this.interface,
    );
  }

  initTop() {
    return UnitTopContainer.getAll();
  }

  initHead() {
    return UnitHeadContainer.getAll();
  }

  initHair() {
    return UnitHairContainer.getAll();
  }

  initInterface() {
    this.interface = new UnitInterface(this);
  }

  animate() {
    for (const container of this.children) {
      container.visible = false;

      if (this.state === "MOVING") {
        this.animationMovingLeft.animationSpeed = 0.25;
        this.animationMovingRight.animationSpeed = 0.25;

        if (this.direction === "RIGHT") {
          this.animationMovingRight.visible = true;
          this.animationMovingRight.play();
        }
        if (this.direction === "LEFT") {
          this.animationMovingLeft.visible = true;
          this.animationMovingLeft.play();
        }
      }

      if (
        this.state === "IDLE" ||
        this.state === "CHOPPING" ||
        this.state === "MINING"
      ) {
        this.animationMovingLeft.animationSpeed = 0;
        this.animationMovingRight.animationSpeed = 0;
        this.animationMovingLeft.currentFrame = 0;
        this.animationMovingRight.currentFrame = 0;

        if (this.direction === "LEFT") {
          this.animationMovingLeft.visible = true;
        }
        if (this.direction === "RIGHT") {
          this.animationMovingRight.visible = true;
        }
      }

      this.drawTop(container);
      this.drawHead(container);
      this.drawHair(container);
    }

    this.interface.animate();

    if (this.target) {
      if (this.target instanceof Flag) {
        this.target.visible = true;
      }
    }
  }

  drawTop(container: GraphicsContainer) {
    if (container instanceof UnitTopContainer) {
      if (container.visual !== this.visual.top) {
        return;
      }
      if (container.direction !== this.direction) {
        return;
      }

      container.visible = true;
    }
  }

  drawHead(container: GraphicsContainer) {
    if (container instanceof UnitHeadContainer) {
      if (container.visual !== this.visual.head) {
        return;
      }
      if (container.direction !== this.direction) {
        return;
      }

      container.visible = true;
    }
  }

  drawHair(container: GraphicsContainer) {
    if (container instanceof UnitHairContainer) {
      if (container.visual !== this.visual.hairstyle) {
        return;
      }
      if (container.direction !== this.direction) {
        return;
      }

      container.visible = true;
    }
  }

  update(object: IGameObjectUnit) {
    this.x = object.x;
    this.y = object.y;
    this.zIndex = Math.round(object.y + 1);

    this.entity = object.entity;
    this.state = object.state;
    this.direction = object.direction;
    this.target = object.target;
    this.inventory = object.inventory;
    this.visual = object.visual;
    this.coins = object.coins;

    this.health = object.health;
  }
}
