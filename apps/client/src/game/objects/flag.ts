import { Sprite } from "pixi.js";
import type { IGameObjectFlag } from "../../../../../packages/api-sdk/src";
import type { Game } from "../game";
import { GameObjectContainer } from "./gameObjectContainer";

interface IFlagOptions {
  game: Game;
  object: IGameObjectFlag;
}

export class Flag extends GameObjectContainer implements IGameObjectFlag {
  public isOnScreen: boolean;

  constructor({ game, object }: IFlagOptions) {
    super({ game, ...object });

    this.isOnScreen = object.isOnScreen;
    this.update(object);
    this.init();
  }

  init() {
    const sprite = Sprite.from("flag1");
    if (sprite) {
      sprite.anchor.set(0.5, 1);
      this.addChild(sprite);
    }
  }

  animate() {
    if (this.state === "IDLE") {
    }

    if (this.state === "DESTROYED") {
      this.visible = false;
    }
  }

  update(object: IGameObjectFlag) {
    this.x = object.x;
    this.y = object.y;
    this.zIndex = Math.round(object.y);

    this.entity = object.entity;
    this.state = object.state;
    this.direction = object.direction;
    this.health = object.health;
  }
}
