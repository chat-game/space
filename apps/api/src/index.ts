import { serve } from "@hono/node-server";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { serveBot } from "./bot";
import {
	findActivePlayers,
	findCommands,
	findOrCreatePlayer,
	findTreeToChop,
	findTrees,
	findVillage,
	updatePlayer,
	updateTree,
} from "./db.repository.ts";
import { serveTree } from "./tree.ts";

const app = new Hono();

app.use("/*", cors());

app.get("/commands", async (c) => {
	const commands = await findCommands();

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

app.get("/trees", async (c) => {
	const trees = await findTrees();

	return c.json(trees);
});
app.get("/trees/chop", async (c) => {
	const trees = await findTreeToChop();

	return c.json(trees);
});
app.patch("trees/:id", async (c) => {
	const id = c.req.param("id");
	const body = await c.req.json<{ size: number }>();

	await updateTree({ id, size: body.size });

	return c.json({
		ok: true,
	});
});

app.get("/village", async (c) => {
	const village = await findVillage();

	return c.json(village);
});

const port = 4001;
console.log(`Server is running on port ${port}`);

void serveBot();
void serveTree();

serve({
	fetch: app.fetch,
	port,
});
