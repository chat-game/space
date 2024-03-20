import { promises as fs } from "node:fs";
import { RefreshingAuthProvider } from "@twurple/auth";
import { Bot, createBotCommand } from "@twurple/easy-bot";
import {
	createCommand,
	findOrCreatePlayer,
	findTreeToChop,
	setPlayerChopping,
	setTreeInProgress,
} from "./db.repository.ts";

export async function serveBot() {
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
			createBotCommand(
				"рубить",
				async (params, { userId, userName, reply }) => {
					console.log(userId, userName, params);

					const player = await findOrCreatePlayer({
						twitchId: userId,
						userName,
					});
					if (!player || player.isBusy) {
						// No way
						void reply(`${userName}, ты пока занят(а).`);
						return;
					}

					// Find tree
					const tree = await findTreeToChop();
					if (!tree || !tree.id) {
						void reply(
							`${userName}, нет доступного дерева. Может скоро подрастет?`,
						);
						return;
					}

					// Send player to chop
					const x = tree.x;
					const y = tree.y;

					await setPlayerChopping({ id: player.id, x, y });

					// Working time
					await setTreeInProgress(tree.id);

					await createCommand({
						playerId: player.id,
						command: "!рубить",
						target: tree.id,
					});

					void reply(`${userName}, ты рубишь дерево!`);
				},
			),
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
