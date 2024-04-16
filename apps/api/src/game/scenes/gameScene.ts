import { createId } from "@paralleldrive/cuid2";
import {
  type ChatAction,
  type EventType,
  type GameSceneType,
  type GetSceneResponse,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import {
  ADMIN_PLAYER_ID,
  DISCORD_SERVER_INVITE_URL,
  DONATE_URL,
  SERVER_TICK_MS,
} from "../../config";
import { sendMessage } from "../../websocket/websocket.server";
import { Event, Group, Raid } from "../common";
import type { Game } from "../game";
import {
  Flag,
  type GameObject,
  Player,
  Rabbit,
  type Stone,
  type Tree,
  Wolf,
} from "../objects";

interface GameSceneOptions {
  game: Game;
  group: Group | undefined;
  possibleActions: ChatAction[];
  canAddNewPlayer: boolean;
}

export class GameScene {
  public id: string;
  public game: Game;
  public objects: GameObject[] = [];
  public group: Group | undefined;
  public raids: Raid[] = [];
  public events: Event[] = [];
  public possibleActions: ChatAction[] = [];
  public canAddNewPlayer = false;

  constructor({
    game,
    group,
    possibleActions,
    canAddNewPlayer,
  }: GameSceneOptions) {
    this.id = createId();
    this.game = game;
    this.group = group;
    this.possibleActions = possibleActions;
    this.canAddNewPlayer = canAddNewPlayer;

    void this.play();
  }

  public async play() {
    return setInterval(() => {
      this.handleEvents();

      for (const obj of this.objects) {
        obj.live();

        if (obj instanceof Player && obj.state === "IDLE") {
          const random = getRandomInRange(1, 800);
          if (random <= 1) {
            const randObj = this.getRandomFlag();
            if (!randObj) {
              return;
            }
            obj.setTarget(randObj);
          }
        }
        if (obj instanceof Rabbit && obj.state === "IDLE") {
          const random = getRandomInRange(1, 100);
          if (random <= 1) {
            const randomObj = this.getRandomFlag();
            if (!randomObj) {
              return;
            }
            obj.setTarget(randomObj);
          }
        }
        if (obj instanceof Wolf && obj.state === "IDLE") {
          const random = getRandomInRange(1, 100);
          if (random <= 1) {
            const randomObj = this.getRandomFlag();
            if (!randomObj) {
              return;
            }
            obj.setTarget(randomObj);
          }
        }
      }

      for (const raid of this.raids) {
        // Stop raid?
        if (raid.raidEndsAt.getTime() <= new Date().getTime()) {
          this.stopRaid(raid);
        }
        if (raid.raidDeletesAt.getTime() <= new Date().getTime()) {
          this.removeRaid(raid);
        }

        for (const raider of raid.raiders) {
          if (raider.state === "IDLE") {
            const random = getRandomInRange(1, 100);
            if (random <= 1) {
              const randomObj = this.getRandomFlag();
              if (!randomObj) {
                return;
              }
              raider.setTarget(randomObj);
            }
          }
          raider.live();
        }
      }
    }, SERVER_TICK_MS);
  }

  destroy() {
    this.objects = [];
  }

  public async handleAction(
    action: ChatAction,
    playerId: string,
    params?: string[],
  ) {
    const player = await this.findOrCreatePlayer(playerId);
    if (!player) {
      return {
        ok: false,
        message: "Тебя нет в активной игре :(",
      };
    }

    if (action === "CHOP") {
      return this.chopAction(player);
    }
    if (action === "MINE") {
      return this.mineAction(player);
    }
    if (action === "START_GROUP_BUILD") {
      // Admin only
      if (player.id !== ADMIN_PLAYER_ID) {
        return {
          ok: false,
          message: null,
        };
      }
      return this.startGroupBuildAction(player, params);
    }
    if (action === "DISBAND_GROUP") {
      // Admin only
      if (player.id !== ADMIN_PLAYER_ID) {
        return {
          ok: false,
          message: null,
        };
      }
      return this.disbandGroupAction();
    }
    if (action === "JOIN_GROUP") {
      return this.joinGroupAction(player);
    }
    if (action === "HELP") {
      return this.helpAction(player);
    }
    if (action === "DONATE") {
      return this.donateAction(player);
    }

    return {
      ok: false,
      message: null,
    };
  }

  checkIfActionIsPossible(action: ChatAction) {
    return this.possibleActions.find((a) => a === action);
  }

  initEvent(type: EventType, secondsToEnd: number) {
    this.events.push(new Event({ type, secondsToEnd }));
  }

  getEvents() {
    return this.events;
  }

  getInfo(): GetSceneResponse {
    return {
      id: this.id,
      commands: this.getAvailableCommands(),
      events: this.getEvents(),
      group: this.group,
    };
  }

  handleEvents() {
    for (const event of this.events) {
      const status = event.checkStatus();

      if (status === "STOPPED") {
        // Stop
        this.game.initScene("VILLAGE");

        const index = this.events.indexOf(event);
        this.events.splice(index, 1);
      }
    }
  }

  getAvailableCommands() {
    const commands: string[] = [];
    for (const action of this.possibleActions) {
      if (action === "HELP") {
        commands.push("!помощь");
      }
      if (action === "CHOP") {
        commands.push("!рубить");
      }
      if (action === "MINE") {
        commands.push("!добыть");
      }
      if (action === "DONATE") {
        commands.push("!донат");
      }
    }

    return commands;
  }

  async findOrCreatePlayer(id: string) {
    const player = this.findPlayer(id);
    if (!player) {
      // Is scene give possibility?
      if (this.canAddNewPlayer) {
        return await this.createPlayer(id);
      }
    }
    return player;
  }

  public findPlayer(id: string) {
    const player = this.objects.find((p) => p.id === id);
    if (player instanceof Player) {
      return player;
    }
  }

  async initPlayer(id: string) {
    const instance = new Player(id);
    await instance.readFromDB();
    await instance.initInventory();
    await instance.initSkills();
    return instance;
  }

  async initActivePlayers() {
    const playersFromDb = await this.game.repository.findActivePlayers();
    for (const player of playersFromDb) {
      const instance = await this.initPlayer(player.id);
      this.objects.push(instance);
    }
  }

  async initGroupPlayers() {
    if (!this.group) {
      return;
    }

    for (const player of this.group.players) {
      const instance = await this.initPlayer(player.id);
      this.objects.push(instance);
    }
  }

  public async createPlayer(id: string): Promise<Player> {
    const player = this.findPlayer(id);
    if (!player) {
      const instance = await this.initPlayer(id);
      this.objects.push(instance);
      return instance;
    }
    return player;
  }

  async chopAction(player: Player) {
    if (!this.checkIfActionIsPossible("CHOP")) {
      return {
        ok: false,
        message: "Сейчас этого сделать нельзя.",
      };
    }
    if (player.state === "CHOPPING") {
      return {
        ok: false,
        message: `${player.userName}, ты пока занят(а).`,
      };
    }

    const tree = this.getRandomTree();
    if (!tree) {
      return {
        ok: false,
        message: `${player.userName}, нет свободного дерева.`,
      };
    }

    player.setTarget(tree);

    return {
      ok: true,
      message: null,
    };
  }

  async mineAction(player: Player) {
    if (!this.checkIfActionIsPossible("MINE")) {
      return {
        ok: false,
        message: "Сейчас этого сделать нельзя.",
      };
    }
    if (player.state === "MINING") {
      return {
        ok: false,
        message: `${player.userName}, ты пока занят(а).`,
      };
    }

    const stone = this.getRandomStone();
    if (!stone) {
      return {
        ok: false,
        message: `${player.userName}, нет свободного камня.`,
      };
    }

    player.setTarget(stone);

    return {
      ok: true,
      message: null,
    };
  }

  disbandGroupAction() {
    if (!this.checkIfActionIsPossible("DISBAND_GROUP")) {
      return {
        ok: false,
        message: "Сейчас этого сделать нельзя.",
      };
    }

    this.group?.disband();
    this.group = undefined;

    return {
      ok: true,
      message: "Группа расформирована!",
    };
  }

  startGroupBuildAction(player: Player, params?: string[]) {
    if (!this.checkIfActionIsPossible("START_GROUP_BUILD")) {
      return {
        ok: false,
        message: "Сейчас этого сделать нельзя.",
      };
    }

    if (!params) {
      return {
        ok: false,
        message: "Не указана цель.",
      };
    }

    const target = this.getSceneTypeFromChatCommand(params[1]);
    if (!target) {
      return {
        ok: false,
        message: "Неверно указана цель. В деревню, на защиту.",
      };
    }

    this.group = new Group(player, target);

    this.initEvent("FORMING_GROUP", 60);
    sendMessage("GROUP_FORM_STARTED");

    return {
      ok: true,
      message: "Начинаем собирать группу!",
    };
  }

  getSceneTypeFromChatCommand(text: string): GameSceneType | null {
    if (text === "деревня" || text === "деревню") {
      return "VILLAGE";
    }
    if (text === "защиту" || text === "защита") {
      return "DEFENCE";
    }

    return null;
  }

  joinGroupAction(player: Player) {
    if (!this.checkIfActionIsPossible("JOIN_GROUP")) {
      return {
        ok: false,
        message: "Сейчас этого сделать нельзя.",
      };
    }

    if (!this.group) {
      return {
        ok: false,
        message: "Нет группы.",
      };
    }

    const joined = this.group.join(player);
    if (!joined) {
      return {
        ok: false,
        message: "Ты уже в группе.",
      };
    }

    return {
      ok: true,
      message: `${player.userName}, ты вступил(а) в группу!`,
    };
  }

  getRandomTree() {
    const onlyReadyToChop = this.objects.filter(
      (obj) => obj.entity === "TREE" && obj.state !== "DESTROYED",
    );
    return onlyReadyToChop.length
      ? (onlyReadyToChop[
          getRandomInRange(0, onlyReadyToChop.length - 1)
        ] as Tree)
      : undefined;
  }

  getRandomStone() {
    const onlyReady = this.objects.filter(
      (obj) => obj.entity === "STONE" && obj.state !== "DESTROYED",
    );
    return onlyReady.length
      ? (onlyReady[getRandomInRange(0, onlyReady.length - 1)] as Stone)
      : undefined;
  }

  getRandomFlag() {
    const flagsOnScreen = this.objects.filter(
      (obj) => obj.entity === "FLAG" && obj instanceof Flag && obj.isOnScreen,
    );
    return flagsOnScreen[getRandomInRange(0, flagsOnScreen.length - 1)];
  }

  public startRaidAction(raidersCount = 0) {
    const raid = new Raid(raidersCount);
    this.raids.push(raid);
    sendMessage("RAID_STARTED");
    return {
      ok: true,
      message: null,
    };
  }

  public stopRaid(raid: Raid) {
    const raidersCamp = this.objects.find((f) => f.id === "raiders-camp");
    if (!raidersCamp) {
      return;
    }

    raid.moveAllRaidersBackToCamp(raidersCamp as Flag);
  }

  public removeRaid(raid: Raid) {
    const index = this.raids.indexOf(raid);
    if (index >= 0) {
      this.raids.splice(index, 1);
    }
  }

  public helpAction(player: Player) {
    if (!this.checkIfActionIsPossible("HELP")) {
      return {
        ok: false,
        message: null,
      };
    }
    return {
      ok: true,
      message: `${player.userName}, это интерактивная игра-чат, в которой может участвовать любой зритель! Пиши команды (примеры на экране) для управления своим героем. Вступай в наше комьюнити: ${DISCORD_SERVER_INVITE_URL}`,
    };
  }

  public donateAction(player: Player) {
    if (!this.checkIfActionIsPossible("DONATE")) {
      return {
        ok: false,
        message: null,
      };
    }
    return {
      ok: true,
      message: `${player.userName}, поддержи игру: ${DONATE_URL}`,
    };
  }
}
