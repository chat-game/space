import { createBotCommand } from "@twurple/easy-bot";
import { DISCORD_SERVER_INVITE_URL, DONATE_URL } from "../config";
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

  public commandChop() {
    return createBotCommand(
      "рубить",
      async (params, { userId, userName, reply }) => {
        console.log("рубить", userId, userName, params);

        const player = await this.game.findOrCreatePlayer(userId, userName);
        if (player.state === "CHOPPING") {
          void reply(`${userName}, ты пока занят(а).`);
          return;
        }

        const sent = this.game.sendPlayerToChopATree(player);
        if (!sent) {
          void reply(`${userName}, нет доступного дерева.`);
          return;
        }
      },
    );
  }

  public commandMine() {
    return createBotCommand(
      "добывать",
      async (params, { userId, userName, reply }) => {
        console.log("добывать", userId, userName, params);

        const player = await this.game.findOrCreatePlayer(userId, userName);
        if (player.state === "MINING") {
          void reply(`${userName}, ты пока занят(а).`);
          return;
        }

        const sent = this.game.sendPlayerToMineStone(player);
        if (!sent) {
          void reply(`${userName}, нет доступного камня.`);
          return;
        }
      },
    );
  }

  public commandGift() {
    return createBotCommand(
      "подарить",
      async (params, { userId, userName, reply }) => {
        console.log("подарить", userId, userName, params);

        const player = await this.game.findOrCreatePlayer(userId, userName);
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

        const player = await this.game.findOrCreatePlayer(userId, userName);
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

        const player = await this.game.findOrCreatePlayer(userId, userName);
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
        await this.game.findOrCreatePlayer(userId, userName);

        void reply(
          `${userName}, это интерактивная игра-чат, в которой может участвовать любой зритель! Пиши команды (примеры на экране) для управления своим героем. Вступай в наше комьюнити: ${DISCORD_SERVER_INVITE_URL}`,
        );
        return;
      },
    );
  }

  public commandHelpEn() {
    return createBotCommand("help", async (_, { userId, userName, reply }) => {
      await this.game.findOrCreatePlayer(userId, userName);

      void reply(
        `${userName}, this is an interactive chat game that any viewer can participate in! Write commands (examples on the screen) to control your hero. Join our community: ${DISCORD_SERVER_INVITE_URL}`,
      );
      return;
    });
  }

  public commandDonate() {
    return createBotCommand("донат", async (_, { userId, userName, reply }) => {
      await this.game.findOrCreatePlayer(userId, userName);

      void reply(`${userName}, поддержи игру: ${DONATE_URL}`);
      return;
    });
  }

  public commandDonateEn() {
    return createBotCommand(
      "donate",
      async (_, { userId, userName, reply }) => {
        await this.game.findOrCreatePlayer(userId, userName);

        void reply(`${userName}, support the game: ${DONATE_URL}`);
        return;
      },
    );
  }

  public async reactOnRaid({
    userName,
    userId,
    viewerCount,
  }: { userName: string; userId: string; viewerCount: number }) {
    console.log("raid!", userName, userId, viewerCount);

    await this.game.findOrCreatePlayer(userId, userName);
  }
}
