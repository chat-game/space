import { promises as fs } from "node:fs";
import { createId } from "@paralleldrive/cuid2";
import { RefreshingAuthProvider } from "@twurple/auth";
import { Bot, createBotCommand } from "@twurple/easy-bot";
import { createPlayer, updatePlayer } from "./client.ts";
import type { Command } from "./types";

export async function serveBot(commands: Command[]) {
	const channel = process.env.TWITCH_CHANNEL_NAME as string;
	const userId = process.env.TWITCH_CHANNEL_ID as string;

	const clientId = process.env.TWITCH_CLIENT_ID as string;
	const clientSecret = process.env.TWITCH_SECRET_ID as string;

	const tokenFilePath = `./apps/api/tmp/${userId}.token.json`;

	const tokenData = JSON.parse(await fs.readFile(tokenFilePath, "utf-8"));

	const authProvider = new RefreshingAuthProvider({
		clientId,
		clientSecret,
	});

	authProvider.onRefresh(
		async (_, newTokenData) =>
			await fs.writeFile(
				tokenFilePath,
				JSON.stringify(newTokenData, null, 4),
				"utf-8",
			),
	);

	await authProvider.addUserForToken(tokenData, ["chat"]);

	const bot = new Bot({
		authProvider,
		channels: [channel],
		commands: [
			createBotCommand("рубить", (params, { userId, userName, reply }) => {
				console.log(userId, userName, params);

				commands.unshift({
					id: createId(),
					userId,
					userName,
					command: "!рубить",
					createdAt: new Date().getTime(),
				});

				createPlayer({ id: userId, userName });

				const x = Math.random() * 1000;
				const y = Math.random() * 1000;

				updatePlayer({ id: userId, x, y });

				void reply(`${userName}, ты рубишь дерево! (пока не по настоящему)`);
			}),
		],
	});

	setInterval(() => {
		console.log(new Date().getTime(), "Serving bot: OK");
	}, 60000);

	bot.onSub(({ broadcasterName, userName }) => {
		void bot.say(
			broadcasterName,
			`Thanks to @${userName} for subscribing to the channel!`,
		);
	});
	bot.onResub(({ broadcasterName, userName, months }) => {
		void bot.say(
			broadcasterName,
			`Thanks to @${userName} for subscribing to the channel for a total of ${months} months!`,
		);
	});
	bot.onSubGift(({ broadcasterName, gifterName, userName }) => {
		void bot.say(
			broadcasterName,
			`Thanks to @${gifterName} for gifting a subscription to @${userName}!`,
		);
	});
}
