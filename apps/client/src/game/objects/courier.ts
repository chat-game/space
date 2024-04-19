import type { AnimatedSprite } from "pixi.js";
import type {
  IGameInventory,
  IGameObjectCourier,
} from "../../../../../packages/api-sdk/src";
import { GraphicsContainer } from "../components/graphicsContainer";
import type { Game } from "../game";
import { AssetsManager } from "../utils";
import { GameObjectContainer } from "./gameObjectContainer";

interface ICourierOptions {
  game: Game;
  object: IGameObjectCourier;
}

export class Courier extends GameObjectContainer implements IGameObjectCourier {
  public inventory!: IGameInventory;

  children: GraphicsContainer[] = [];
  animationMovingLeft!: AnimatedSprite;
  animationMovingRight!: AnimatedSprite;

  constructor({ game, object }: ICourierOptions) {
    super({ game, ...object });
    this.update(object);

    this.animationMovingLeft = AssetsManager.getAnimatedSpriteHeroLeft();
    this.animationMovingRight = AssetsManager.getAnimatedSpriteHeroRight();

    this.init();
  }

  init() {
    const leftSpriteContainer = GraphicsContainer.createWithSprite(
      "playerLeft",
      "LEFT",
      "PLAYER_IDLE_LEFT",
    );
    const rightSpriteContainer = GraphicsContainer.createWithSprite(
      "playerRight",
      "RIGHT",
      "PLAYER_IDLE_RIGHT",
    );

    const topLeftSpriteContainer = GraphicsContainer.createWithSprite(
      "playerTopLeft",
      "LEFT",
      "PLAYER_TOP_LEFT",
    );

    const topRightSpriteContainer = GraphicsContainer.createWithSprite(
      "playerTopRight",
      "RIGHT",
      "PLAYER_TOP_RIGHT",
    );

    this.addChild(
      leftSpriteContainer,
      topLeftSpriteContainer,
      rightSpriteContainer,
      topRightSpriteContainer,
      this.animationMovingLeft,
      this.animationMovingRight,
    );
  }

  animate() {
    for (const container of this.children) {
      container.visible = false;

      if (this.state === "MOVING") {
        if (this.direction === "RIGHT") {
          this.animationMovingRight.animationSpeed = 0.25;
          this.animationMovingRight.visible = true;
          this.animationMovingRight.play();

          if (container.type === "PLAYER_TOP_RIGHT") {
            container.visible = true;
          }
        }
        if (this.direction === "LEFT") {
          this.animationMovingLeft.animationSpeed = 0.25;
          this.animationMovingLeft.visible = true;
          this.animationMovingLeft.play();

          if (container.type === "PLAYER_TOP_LEFT") {
            container.visible = true;
          }
        }
      }

      if (
        this.state === "IDLE" ||
        this.state === "CHOPPING" ||
        this.state === "MINING"
      ) {
        if (this.direction === "LEFT") {
          if (container.type === "PLAYER_IDLE_LEFT") {
            container.visible = true;
          }
          if (container.type === "PLAYER_TOP_LEFT") {
            container.visible = true;
          }
        }
        if (this.direction === "RIGHT") {
          if (container.type === "PLAYER_IDLE_RIGHT") {
            container.visible = true;
          }
          if (container.type === "PLAYER_TOP_RIGHT") {
            container.visible = true;
          }
        }
      }
    }
  }

  update(object: IGameObjectCourier) {
    this.x = object.x;
    this.y = object.y;
    this.zIndex = Math.round(object.y + 1);

    this.entity = object.entity;
    this.state = object.state;
    this.direction = object.direction;
    this.inventory = object.inventory;

    this.health = object.health;
  }
}
