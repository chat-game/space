import { Hono } from "hono";
import { cors } from "hono/cors";
import { BotController } from "./bot/bot.controller";
import { findTopPlayers, findVillage } from "./db.repository";
import { Game } from "./game/game";

// Go-go!
const game = new Game();

const app = new Hono();

app.use("/*", cors());

app.get("/players/top", async (c) => {
  const players = await findTopPlayers();
  return c.json(players);
});

app.get("/village", async (c) => {
  const village = await findVillage();
  return c.json(village);
});

app.get("/scene", (c) => {
  const scene = game.scene.getInfo();
  return c.json(scene);
});

const port = 4001;
console.log(`HTTP server: listening on localhost:${port}`);

// Getting messages from Chat and reacting to them
void new BotController(game).serve();

export default {
  port,
  fetch: app.fetch,
};
