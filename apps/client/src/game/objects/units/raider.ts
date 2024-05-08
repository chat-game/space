import type { IGameObjectRaider } from "../../../../../../packages/api-sdk/src";
import type { Game } from "../../game";
import { Unit } from "./unit";

interface IRaiderOptions {
  game: Game;
  object: IGameObjectRaider;
}

export class Raider extends Unit implements IGameObjectRaider {
  userName!: string;
  colorIndex!: number;

  constructor({ game, object }: IRaiderOptions) {
    super({ game, object });
  }
}
