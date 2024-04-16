import { type Application, TilingSprite } from "pixi.js";

export function addBackground(app: Application) {
  const background = TilingSprite.from("background", {
    width: app.screen.width,
    height: app.screen.height,
  });

  background.tilePosition.x = 100;
  background.tilePosition.y = 100;

  app.stage.addChild(background);
}
