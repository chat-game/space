import { GameObjectContainer } from "./gameObjectContainer";
import type { IGameObjectLake, } from "../../../../../packages/api-sdk/src";
import type { Game } from "../game";
import { AssetsManager } from "../utils";

interface ILakeOptions {
  game: Game;
  object: IGameObjectLake;
}

export class Lake extends GameObjectContainer implements IGameObjectLake {
  public water!: IGameObjectLake["water"];

  constructor({ game, object }: ILakeOptions) {
    super({ game, ...object });

    this.update(object);
    this.water = object.water;
    this.init();
  }

  init() {
    for (const w of this.water) {
      const sprite = AssetsManager.getRandomSpriteForWater();
      sprite.anchor.set(0.5, 1);
      sprite.x = w.x;
      sprite.y = w.y;
      this.addChild(sprite);
    }
  }

  update(object: IGameObjectLake) {
    super.update(object);

    this.zIndex = 0;
  }
}