import { promises as fs } from "node:fs";
import { RefreshingAuthProvider } from "@twurple/auth";
import { Bot, createBotCommand } from "@twurple/easy-bot";

const channel = process.env.TWITCH_CHANNEL_NAME;
const userId = process.env.TWITCH_CHANNEL_ID;

const clientId = process.env.TWITCH_CLIENT_ID;
const clientSecret = process.env.TWITCH_SECRET_ID;

const tokenFilePath = `./server/${userId}.token.json`;

const tokenData = JSON.parse(await fs.readFile(tokenFilePath, "utf-8"));

const authProvider = new RefreshingAuthProvider({
	clientId,
	clientSecret,
});

authProvider.onRefresh(
	async (userId, newTokenData) =>
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

			void reply(`${userName}, ты рубишь дерево! 30 шт/минуту`);
		}),
		createBotCommand("slap", (params, { userName, say }) => {
			void say(
				`${userName} slaps ${params.join(" ")} around a bit with a large trout`,
			);
		}),
	],
});

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
