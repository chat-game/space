import { Application } from "pixi.js";

export class SceneManager {
  public app: Application;

  constructor() {
    this.app = new Application();
    void this.init();
  }

  public async init() {
    await this.app.init({
      background: "#ffffff",
      resizeTo: window,
      antialias: true,
      roundPixels: false,
      resolution: 1
    });
    document.getElementById("game-canvas")?.appendChild(this.app.canvas);
  }
}
