import { Hono } from "hono";
import { cors } from "hono/cors";
import { BotController } from "./bot/bot.controller";
import { findTopByReputationPlayers, findVillage } from "./db.repository";
import { Game } from "./game/game";

const app = new Hono();

app.use("/*", cors());

app.get("/players/top", async (c) => {
  const players = await findTopByReputationPlayers();

  return c.json(players);
});

app.get("/village", async (c) => {
  const village = await findVillage();

  return c.json(village);
});

const port = 4001;
console.log(`HTTP server: listening on localhost:${port}`);

// Go-go!
const game = new Game();
game.init().then(() => game.play());

// Getting messages from Chat and reacting to them
void new BotController(game).serve();

export default {
  port,
  fetch: app.fetch,
};
