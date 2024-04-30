import type { IGameObjectFarmer } from "../../../../../packages/api-sdk/src";
import type { Game } from "../game";
import { Unit } from "./units/unit.ts";

interface IFarmerOptions {
  game: Game;
  object: IGameObjectFarmer;
}

export class Farmer extends Unit implements IGameObjectFarmer {
  constructor({ game, object }: IFarmerOptions) {
    super({ game, object });
  }
}
