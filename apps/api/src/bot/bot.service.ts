import { createBotCommand } from "@twurple/easy-bot";
import { TWITCH_CHANNEL_REWARDS } from "../config";
import type { Game } from "../game/game";

export class BotService {
  public game: Game;

  constructor(game: Game) {
    this.game = game;
  }

  public commandStartChangingScene() {
    return createBotCommand(
      "вернуться",
      async (params, { userId, userName, reply }) => {
        const result = await this.game.handleChatCommand({
          action: "START_CHANGING_SCENE",
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
        const result = await this.game.handleChatCommand({
          action: "GIFT",
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

  public commandSell() {
    return createBotCommand(
      "продать",
      async (params, { userId, userName, reply }) => {
        const result = await this.game.handleChatCommand({
          action: "SELL",
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

  public commandBuy() {
    return createBotCommand(
      "купить",
      async (params, { userId, userName, reply }) => {
        const result = await this.game.handleChatCommand({
          action: "BUY",
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
