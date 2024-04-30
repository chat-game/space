import type { IGameObjectBuilding } from "../../../../../../packages/api-sdk/src";
import type { Game } from "../../game";
import { GameObjectContainer } from "../gameObjectContainer";

interface IBuildingOptions {
  game: Game;
  object: IGameObjectBuilding;
}

export class Building
  extends GameObjectContainer
  implements IGameObjectBuilding
{
  public inventory!: IGameObjectBuilding["inventory"];

  constructor({ game, object }: IBuildingOptions) {
    super({ game, ...object });

    this.update(object);
  }

  animate() {
    if (this.state === "DESTROYED") {
      this.visible = false;
    }
  }

  update(object: IGameObjectBuilding) {
    this.x = object.x;
    this.y = object.y;
    this.zIndex = Math.round(object.y);

    this.entity = object.entity;
    this.state = object.state;
    this.direction = object.direction;
    this.health = object.health;
    this.inventory = object.inventory;
    this.isVisibleOnClient = object.isVisibleOnClient;
  }
}
