import { Application, Assets, Sprite, TilingSprite } from "pixi.js";

const gameDiv = document.getElementById("game");

// The application will create a renderer using WebGL, if possible,
// with a fallback to a canvas render. It will also set up the ticker
// and the root stage PIXI.Container
const app = new Application();

// Wait for the Renderer to be available
await app.init({
	width: window.innerWidth,
	height: window.innerHeight,
});

gameDiv?.appendChild(app.canvas);

// Load textures
const grassTexture = await Assets.load("Grass_Sample.png");
const heroTexture = await Assets.load("hero/hero_64.png");

// Show sprites
const grassTilingSprite = new TilingSprite({
	texture: grassTexture,
	width: app.canvas.width,
	height: app.canvas.height,
});
const heroSprite = Sprite.from(heroTexture);

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
