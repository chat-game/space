import { Sprite } from "pixi.js";
import type { IGameObjectBuilding } from "../../../../../packages/api-sdk/src";
import { BuildingInterface } from "../components/buildingInterface";
import type { Game } from "../game";
import { GameObjectContainer } from "./gameObjectContainer";

interface IBuildingOptions {
  game: Game;
  object: IGameObjectBuilding;
}

export class Building
  extends GameObjectContainer
  implements IGameObjectBuilding
{
  public type!: IGameObjectBuilding["type"];
  public inventory!: IGameObjectBuilding["inventory"];

  public interface!: BuildingInterface;

  constructor({ game, object }: IBuildingOptions) {
    super({ game, ...object });

    this.update(object);
    this.init();

    if (object.type === "WAREHOUSE") {
      this.initInterface();
    }
  }

  init() {
    const sprite = this.getSpriteByType();
    if (sprite) {
      sprite.anchor.set(0.5, 1);
      this.addChild(sprite);
    }
  }

  initInterface() {
    this.interface = new BuildingInterface(this);
    this.addChild(this.interface);
  }

  getSpriteByType() {
    if (this.type === "CAMP_FIRE") {
      return Sprite.from("campFire1");
    }
    if (this.type === "WAREHOUSE") {
      return Sprite.from("warehouse1");
    }
  }

  animate() {
    if (this.state === "IDLE") {
    }

    if (this.state === "DESTROYED") {
      this.visible = false;
    }

    if (this.interface) {
      this.interface.animate();
    }
  }

  update(object: IGameObjectBuilding) {
    this.x = object.x;
    this.y = object.y;
    this.zIndex = Math.round(object.y);

    this.type = object.type;
    this.entity = object.entity;
    this.state = object.state;
    this.direction = object.direction;
    this.health = object.health;
    this.inventory = object.inventory;
  }
}
