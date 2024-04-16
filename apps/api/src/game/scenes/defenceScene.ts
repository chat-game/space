import type { Group } from "../common";
import type { Game } from "../game";
import { GameScene } from "./gameScene";

export class DefenceScene extends GameScene {
  constructor(game: Game, group: Group | undefined) {
    super({ game, group, canAddNewPlayer: false, possibleActions: ["MINE"] });
  }
}
