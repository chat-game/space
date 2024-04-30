import type { IGameObjectCourier } from "../../../../../packages/api-sdk/src";
import type { Game } from "../game";
import { Unit } from "./units/unit.ts";

interface ICourierOptions {
  game: Game;
  object: IGameObjectCourier;
}

export class Courier extends Unit implements IGameObjectCourier {
  constructor({ game, object }: ICourierOptions) {
    super({ game, object });
  }
}
