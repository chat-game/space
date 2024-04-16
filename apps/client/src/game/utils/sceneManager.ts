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
      antialias: false,
      roundPixels: false,
    });
    document.getElementById("game-canvas")?.appendChild(this.app.canvas);
  }
}
