import { createBotCommand } from "@twurple/easy-bot";
import { TWITCH_CHANNEL_REWARDS } from "../config";
import {
  addStoneToVillage,
  addWoodToVillage,
  createCommand,
} from "../db.repository";
import type { Game } from "../game/game";

export class BotService {
  public game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public commandStartGroupBuild() {
    return createBotCommand(
      "собрать",
      async (params, { userId, userName, reply }) => {
        const result = await this.game.handleChatCommand({
          action: "START_GROUP_BUILD",
          userId,
          userName,
          params,
        });
        if (result.message) {
          void reply(result.message);
        }
      },
    );
  }

  public commandJoinGroup() {
    return createBotCommand("го", async (_, { userId, userName, reply }) => {
      const result = await this.game.handleChatCommand({
        action: "JOIN_GROUP",
        userId,
        userName,
      });
      if (result.message) {
        void reply(result.message);
      }
    });
  }

  public commandDisbandGroup() {
    return createBotCommand(
      "расформировать",
      async (_, { userId, userName, reply }) => {
        const result = await this.game.handleChatCommand({
          action: "DISBAND_GROUP",
          userId,
          userName,
        });
        if (result.message) {
          void reply(result.message);
        }
      },
    );
  }

  public commandChop() {
    return createBotCommand(
      "рубить",
      async (_, { userId, userName, reply }) => {
        const result = await this.game.handleChatCommand({
          action: "CHOP",
          userId,
          userName,
        });
        if (result.message) {
          void reply(result.message);
        }
      },
    );
  }

  public commandMine() {
    return createBotCommand(
      "добыть",
      async (_, { userId, userName, reply }) => {
        const result = await this.game.handleChatCommand({
          action: "MINE",
          userId,
          userName,
        });
        if (result.message) {
          void reply(result.message);
        }
      },
    );
  }

  public commandGift() {
    return createBotCommand(
      "подарить",
      async (params, { userId, userName, reply }) => {
        console.log("подарить", userId, userName, params);

        const player = await this.game.repository.findOrCreatePlayer(
          userId,
          userName,
        );
        const items = player.inventory?.items ?? [];

        if (params[0] === "древесину" || params[0] === "древесина") {
          // Find Wood
          const wood = items.find((item) => item.type === "WOOD");
          if (!wood) {
            void reply(`${userName}, у тебя нет древесины.`);
            return;
          }

          await addWoodToVillage(wood.amount);
          await player.addReputation(wood.amount);
          await player.inventory?.destroyItemInDB(wood.id);

          await createCommand({
            playerId: player.id,
            command: "!подарить",
          });

          void reply(
            `${userName}, ты подарил(а) деревне всю древесину! Твоя репутация возросла.`,
          );
          return;
        }

        if (params[0] === "камень" || params[0] === "камни") {
          const item = items.find((item) => item.type === "STONE");
          if (!item) {
            void reply(`${userName}, у тебя нет камня.`);
            return;
          }

          await addStoneToVillage(item.amount);
          await player.addReputation(item.amount);
          await player.inventory?.destroyItemInDB(item.id);

          await createCommand({
            playerId: player.id,
            command: "!подарить",
          });

          void reply(
            `${userName}, ты подарил(а) деревне все камни! Твоя репутация возросла.`,
          );
          return;
        }

        void reply(
          `${userName}, укажи конкретнее, например: !подарить древесину`,
        );
      },
    );
  }

  public commandSell() {
    return createBotCommand(
      "продать",
      async (params, { userId, userName, reply }) => {
        console.log("продать", userId, userName, params);

        const player = await this.game.repository.findOrCreatePlayer(
          userId,
          userName,
        );
        const items = player.inventory?.items ?? [];

        if (params[0] === "древесину" || params[0] === "древесина") {
          // Find Wood
          const wood = items.find((item) => item.type === "WOOD");
          if (!wood) {
            void reply(`${userName}, у тебя нет древесины.`);
            return;
          }

          await player.updateCoins(wood.amount);
          await player.inventory?.destroyItemInDB(wood.id);

          await createCommand({
            playerId: player.id,
            command: "!продать",
          });

          void reply(`${userName}, ты продал(а) всю древесину торговцу!`);
          return;
        }

        if (params[0] === "камень" || params[0] === "камни") {
          const item = items.find((item) => item.type === "STONE");
          if (!item) {
            void reply(`${userName}, у тебя нет камня.`);
            return;
          }

          await player.updateCoins(item.amount);
          await player.inventory?.destroyItemInDB(item.id);

          await createCommand({
            playerId: player.id,
            command: "!продать",
          });

          void reply(`${userName}, ты продал(а) все камни торговцу!`);
          return;
        }

        void reply(
          `${userName}, укажи конкретнее, например: !продать древесину`,
        );
      },
    );
  }

  public commandBuy() {
    return createBotCommand(
      "купить",
      async (params, { userId, userName, reply }) => {
        console.log("купить", userId, userName, params);

        const player = await this.game.repository.findOrCreatePlayer(
          userId,
          userName,
        );
        const items = player.inventory?.items ?? [];

        if (params[0] === "топор") {
          // Find if already have some
          const axe = items.find((item) => item.type === "AXE");
          if (axe) {
            void reply(`${userName}, у тебя уже есть топор.`);
            return;
          }

          const result = await player.buyItemFromDealer("AXE", 10, 1);
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

        if (params[0] === "кирку" || params[0] === "кирка") {
          const pickaxe = items.find((item) => item.type === "PICKAXE");
          if (pickaxe) {
            void reply(`${userName}, у тебя уже есть кирка.`);
            return;
          }

          const result = await player.buyItemFromDealer("PICKAXE", 10, 1);
          if (!result) {
            void reply(`${userName}, неа.`);
            return;
          }

          await createCommand({
            playerId: player.id,
            command: "!купить",
          });

          void reply(`${userName}, ты купил(а) кирку у торговца!`);
          return;
        }

        void reply(`${userName}, укажи конкретнее, например: !купить топор`);
      },
    );
  }

  public commandHelp() {
    return createBotCommand(
      "помощь",
      async (_, { userId, userName, reply }) => {
        const result = await this.game.handleChatCommand({
          action: "HELP",
          userId,
          userName,
        });
        if (result.message) {
          void reply(result.message);
        }
      },
    );
  }

  // public commandHelpEn() {
  //   return createBotCommand("help", async (_, { userId, userName, reply }) => {
  //     await this.game.repository.findOrCreatePlayer(userId, userName);
  //
  //     void reply(
  //       `${userName}, this is an interactive chat game that any viewer can participate in! Write commands (examples on the screen) to control your hero. Join our community: ${DISCORD_SERVER_INVITE_URL}`,
  //     );
  //     return;
  //   });
  // }

  public commandDonate() {
    return createBotCommand("донат", async (_, { userId, userName, reply }) => {
      const result = await this.game.handleChatCommand({
        action: "DONATE",
        userId,
        userName,
      });
      if (result.message) {
        void reply(result.message);
      }
    });
  }

  // public commandDonateEn() {
  //   return createBotCommand(
  //     "donate",
  //     async (_, { userId, userName, reply }) => {
  //       await this.game.repository.findOrCreatePlayer(userId, userName);
  //
  //       void reply(`${userName}, support the game: ${DONATE_URL}`);
  //       return;
  //     },
  //   );
  // }

  public async reactOnRaid({
    userName,
    userId,
    viewerCount,
  }: { userName: string; userId: string; viewerCount: number }) {
    return this.game.handleChatCommand({
      action: "START_RAID",
      userId,
      userName,
      viewerCount,
    });
  }

  public async reactOnChannelRewardRedemption({
    userId,
    userName,
    rewardId,
  }: { userId: string; userName: string; rewardId: string }) {
    console.log("reactOnChannelRewardRedemption", userId, userName, rewardId);
    const player = await this.game.repository.findOrCreatePlayer(
      userId,
      userName,
    );
    if (rewardId === TWITCH_CHANNEL_REWARDS["150viewerPoints"].id) {
      await this.game.repository.addPlayerViewerPoints(player.id, 150);
      return;
    }
  }
}
