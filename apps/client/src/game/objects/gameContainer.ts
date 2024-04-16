import { Container } from "pixi.js";
import type { Game } from "../game";

export class GameContainer extends Container {
  public game: Game;
  public id: string;

  constructor(game: Game, id: string) {
    super();
    this.game = game;
    this.id = id;
  }

  animate(): void {}
}
