import { promises as fs } from "node:fs";
import { RefreshingAuthProvider } from "@twurple/auth";
import { Bot, createBotCommand } from "@twurple/easy-bot";
import {
  buyAxeFromDealer,
  createCommand,
  donateWoodFromPlayerInventory,
  findOrCreatePlayer,
  findStoneToMine,
  findTreeToChop,
  getInventory,
  reserveStone,
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

          // Send player to tree
          await setPlayerMovingToTarget({
            id: player.id,
            targetId: tree.id,
            x: tree.x,
            y: tree.y,
          });
        },
      ),
      createBotCommand(
        "добывать",
        async (params, { userId, userName, reply }) => {
          console.log("добывать", userId, userName, params);

          const player = await findOrCreatePlayer({
            twitchId: userId,
            userName,
          });
          if (!player || player.isBusy) {
            void reply(`${userName}, ты пока занят(а).`);
            return;
          }

          const stone = await findStoneToMine();
          if (!stone || !stone.id) {
            void reply(
              `${userName}, нет доступного камня. Может скоро освободится?`,
            );
            return;
          }

          await reserveStone(stone.id);

          await setPlayerMovingToTarget({
            id: player.id,
            targetId: stone.id,
            x: stone.x,
            y: stone.y,
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
              `${userName}, ты подарил(а) деревне всю древесину! Твоя репутация возросла.`,
            );
            return;
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

            void reply(`${userName}, ты продал(а) всю древесину торговцу!`);
            return;
          }

          void reply(
            `${userName}, укажи конкретнее, например: !продать древесину`,
          );
        },
      ),
      createBotCommand(
        "купить",
        async (params, { userId, userName, reply }) => {
          console.log("купить", userId, userName, params);

          const player = await findOrCreatePlayer({
            twitchId: userId,
            userName,
          });
          const items = await getInventory(player.id);

          if (params[0] === "топор") {
            // Find if already have some
            const axe = items.find((item) => item.type === "AXE");
            if (axe) {
              // No way
              void reply(`${userName}, у тебя уже есть топор.`);
              return;
            }

            const result = await buyAxeFromDealer(player.id);
            if (!result) {
              void reply(`${userName}, неа.`);
              return;
            }

            await createCommand({
              playerId: player.id,
              command: "!купить",
            });

            void reply(`${userName}, ты купил(а) топор у торговца!`);
            return;
          }

          void reply(`${userName}, укажи конкретнее, например: !купить топор`);
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
