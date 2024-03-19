import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveBot } from "./bot";
import {
	findActivePlayers,
	findOrCreatePlayer,
	updatePlayer,
} from "./db.repository.ts";
import type { Command } from "./types";

// Temp
const commands: Command[] = [];

const app = new Hono();

app.use("/*", cors());

app.get("/commands", (c) => {
	return c.json(commands);
});
app.get("/players", async (c) => {
	const players = await findActivePlayers();

	return c.json(players);
});
app.post("players", async (c) => {
	const body = await c.req.json<{ id: string; userName: string }>();

	await findOrCreatePlayer({ twitchId: body.id, userName: body.userName });

	return c.json({
		ok: true,
	});
});
app.patch("players/:id", async (c) => {
	const id = c.req.param("id");
	const body = await c.req.json<{ x: number; y: number }>();

	await updatePlayer({ twitchId: id, x: body.x, y: body.y });

	return c.json({
		ok: true,
	});
});

const port = 4001;
console.log(`Server is running on port ${port}`);

void serveBot(commands);

serve({
	fetch: app.fetch,
	port,
});
