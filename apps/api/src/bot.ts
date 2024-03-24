import { promises as fs } from "node:fs";
import { RefreshingAuthProvider } from "@twurple/auth";
import { Bot, createBotCommand } from "@twurple/easy-bot";
import {
  createCommand,
  donateWoodFromPlayerInventory,
  findOrCreatePlayer,
  findTreeToChop,
  getInventory,
  reserveTree,
  sellWoodFromPlayerInventory,
  setPlayerMovingToTarget,
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
          console.log("рубить", userId, userName, params);

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

          await reserveTree(tree.id);

          // Send player to chop
          await setPlayerMovingToTarget({
            id: player.id,
            targetId: tree.id,
            x: tree.x,
            y: tree.y,
          });
        },
      ),
      createBotCommand(
        "подарить",
        async (params, { userId, userName, reply }) => {
          console.log("подарить", userId, userName, params);

          const player = await findOrCreatePlayer({
            twitchId: userId,
            userName,
          });
          const items = await getInventory(player.id);

          if (params[0] === "древесину" || params[0] === "древесина") {
            // Find Wood
            const wood = items.find((item) => item.type === "WOOD");
            if (!wood) {
              // No way
              void reply(`${userName}, у тебя нет древесины.`);
              return;
            }

            await donateWoodFromPlayerInventory(player.id);

            await createCommand({
              playerId: player.id,
              command: "!подарить",
            });

            void reply(
              `${userName}, ты подарил деревне всю древесину! Твоя репутация возросла.`,
            );
          }

          void reply(
            `${userName}, укажи конкретнее, например: !подарить древесину`,
          );
        },
      ),
      createBotCommand(
        "продать",
        async (params, { userId, userName, reply }) => {
          console.log("продать", userId, userName, params);

          const player = await findOrCreatePlayer({
            twitchId: userId,
            userName,
          });
          const items = await getInventory(player.id);

          if (params[0] === "древесину" || params[0] === "древесина") {
            // Find Wood
            const wood = items.find((item) => item.type === "WOOD");
            if (!wood) {
              // No way
              void reply(`${userName}, у тебя нет древесины.`);
              return;
            }

            await sellWoodFromPlayerInventory(player.id);

            await createCommand({
              playerId: player.id,
              command: "!продать",
            });

            void reply(`${userName}, ты продал всю древесину торговцу!`);
          }

          void reply(
            `${userName}, укажи конкретнее, например: !продать древесину`,
          );
        },
      ),
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
}
