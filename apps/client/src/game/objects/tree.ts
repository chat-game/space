import { Sprite } from "pixi.js";
import type { IGameObjectTree } from "../../../../../packages/api-sdk/src";
import type { Game } from "../game";
import { GameObjectContainer } from "./gameObjectContainer";

interface ITreeOptions {
  game: Game;
  object: IGameObjectTree;
}

export class Tree extends GameObjectContainer implements IGameObjectTree {
  public type!: IGameObjectTree["type"];
  public resource!: number;
  public size!: number;
  public isReadyToChop!: boolean;

  public animationAngle = 0;
  public animationSlowSpeed = 0.04;
  public animationHighSpeed = 0.15;

  constructor({ game, object }: ITreeOptions) {
    super({ game, ...object });

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
    if (this.type === "1") {
      return Sprite.from("tree1");
    }
    if (this.type === "2") {
      return Sprite.from("tree2");
    }
    if (this.type === "3") {
      return Sprite.from("tree3");
    }
  }

  animate() {
    if (this.state === "IDLE") {
      this.shakeOnWind();
    }

    if (this.state === "DESTROYED") {
      this.visible = false;
    }

    if (this.state === "CHOPPING") {
      this.scale = 0.98;
      this.shakeAnimation();
    }
  }

  shakeAnimation() {
    if (Math.abs(this.animationAngle) >= 2.5) {
      this.animationHighSpeed *= -1;
    }
    this.animationAngle += this.animationHighSpeed;
    this.angle = this.animationAngle;
  }

  shakeOnWind() {
    if (Math.abs(this.animationAngle) >= 1.5) {
      this.animationSlowSpeed *= -1;
    }
    this.animationAngle += this.animationSlowSpeed;
    this.angle = this.animationAngle;
  }

  update(object: IGameObjectTree) {
    this.x = object.x;
    this.y = object.y;
    this.zIndex = Math.round(object.y);

    this.type = object.type;
    this.entity = object.entity;
    this.state = object.state;
    this.direction = object.direction;
    this.health = object.health;
    this.isReadyToChop = object.isReadyToChop;
    this.resource = object.resource;
    this.size = object.size;
  }
}
