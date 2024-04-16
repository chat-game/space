import { Graphics } from "pixi.js";
import type { Game } from "../game";

export interface CameraOptions {
  game: Game;
  viewWidth: number;
  viewHeight: number;
}

export class Camera extends Graphics {
  public game: Game;

  constructor(options: CameraOptions) {
    super();
    this.game = options.game;
    this.draw(options);
  }

  draw({ viewWidth, viewHeight }: { viewWidth: number; viewHeight: number }) {
    this.clear();
    this.fill(0xffffff);
    this.rect(0, 0, viewWidth, viewHeight);
    this.fill();
  }
}
