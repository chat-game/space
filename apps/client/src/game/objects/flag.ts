import { Sprite } from "pixi.js";
import type { IGameObjectFlag } from "../../../../../packages/api-sdk/src";
import type { Game } from "../game";
import { GameObjectContainer } from "./gameObjectContainer";

interface IFlagOptions {
  game: Game;
  object: IGameObjectFlag;
}

export class Flag extends GameObjectContainer implements IGameObjectFlag {
  public type!: IGameObjectFlag["type"];
  public isOnScreen: boolean;

  constructor({ game, object }: IFlagOptions) {
    super({ game, ...object });

    this.isOnScreen = object.isOnScreen;
    this.update(object);
    this.init();
  }

  init() {
    const sprite = this.getSpriteByType();
    if (sprite) {
      sprite.anchor.set(0.5, 1);
      this.addChild(sprite);
    }
  }

  getSpriteByType() {
    if (
      this.type === "MOVEMENT" ||
      this.type === "WAGON_NEAR_MOVEMENT" ||
      this.type === "WAGON_MOVEMENT"
    ) {
      return Sprite.from("flag1");
    }
    if (this.type === "RESOURCE") {
      return Sprite.from("flag2");
    }
  }

  animate() {
    this.visible = false;

    if (
      this.type === "RESOURCE" &&
      this.game.checkIfThisFlagIsTarget(this.id)
    ) {
      this.visible = true;
    }

    if (this.type === "WAGON_MOVEMENT" || this.type === "WAGON_NEAR_MOVEMENT") {
      this.visible = true;
    }

    if (this.state === "DESTROYED") {
      this.visible = false;
    }
  }

  update(object: IGameObjectFlag) {
    this.x = object.x;
    this.y = object.y;
    this.zIndex = Math.round(object.y) + 1;

    this.entity = object.entity;
    this.state = object.state;
    this.direction = object.direction;
    this.health = object.health;
    this.target = object.target;
    this.type = object.type;
  }
}
