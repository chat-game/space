import { RefreshingAuthProvider } from "@twurple/auth";
import { Bot } from "@twurple/easy-bot";
import type { Game } from "../game/game";
import { BotService } from "./bot.service";

export class BotController {
  private readonly channel = process.env.TWITCH_CHANNEL_NAME as string;
  private readonly userId = process.env.TWITCH_CHANNEL_ID as string;
  private readonly clientId = process.env.TWITCH_CLIENT_ID as string;
  private readonly clientSecret = process.env.TWITCH_SECRET_ID as string;

  private readonly service: BotService;

  constructor(game: Game) {
    this.service = new BotService(game);
  }

  private async prepareAuthProvider() {
    const tokenFile = Bun.file(`./apps/api/tmp/${this.userId}.token.json`);
    const tokenData = await tokenFile.json();

    const authProvider = new RefreshingAuthProvider({
      clientId: this.clientId,
      clientSecret: this.clientSecret,
    });

    authProvider.onRefresh(async (_, newTokenData) => {
      const data = JSON.stringify(newTokenData, null, 4);
      await Bun.write(tokenFile, data);
    });

    await authProvider.addUserForToken(tokenData, ["chat"]);

    return authProvider;
  }

  prepareBotCommands() {
    return [
      this.service.commandChop(),
      this.service.commandMine(),
      this.service.commandGift(),
      this.service.commandSell(),
      this.service.commandBuy(),
    ];
  }

  public async serve() {
    const bot = new Bot({
      authProvider: await this.prepareAuthProvider(),
      channels: [this.channel],
      commands: this.prepareBotCommands(),
    });

    bot.onRaid(({ broadcasterName, userName }) => {
      void bot.say(broadcasterName, `@${userName} устроил рейд!`);
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

    return bot;
  }
}
