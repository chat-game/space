import {
  Application,
  Assets,
  ICanvas,
  Sprite,
  Texture,
  TilingSprite,
} from "pixi.js";

const gameDiv = document.getElementById("game");

const app: Application<ICanvas> = new Application({
  resizeTo: window,
  antialias: false,
});

gameDiv?.appendChild(app.view as unknown as Node);

// TilingSprites
const grassTilingSprite = new TilingSprite(
  Texture.from("Grass_Sample.png"),
  app.screen.width,
  app.screen.height,
);

// Sprites
const heroSprite = new Sprite(await Assets.load("hero/hero_64.png"));

// Set up the position of the hero
heroSprite.x = app.renderer.width / 2;
heroSprite.y = app.renderer.height / 2;

// Rotate around the center
heroSprite.anchor.x = 0.5;
heroSprite.anchor.y = 0.5;

heroSprite.width = 64;
heroSprite.height = 64;

// Opt-in to interactivity
heroSprite.eventMode = "static";
heroSprite.cursor = "pointer";
heroSprite.on("pointerdown", onHeroClick);

// Add to the scene we are building
app.stage.addChild(grassTilingSprite);
app.stage.addChild(heroSprite);

// Listen for frame updates
app.ticker.add(() => {
  // heroSprite.x += 0.01;

  grassTilingSprite.tilePosition.x -= 0.3;
});

function onHeroClick() {
  heroSprite.scale.x *= 1.1;
  heroSprite.scale.y *= 1.1;

  setTimeout(() => {
    heroSprite.scale.x = 1;
    heroSprite.scale.y = 1;
  }, 5000);
}
