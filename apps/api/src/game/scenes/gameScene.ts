import { createId } from "@paralleldrive/cuid2";
import {
  type GameSceneType,
  type GetSceneResponse,
  type IGameEvent,
  type IGameSceneAction,
  type ItemType,
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
  Building,
  Courier,
  Flag,
  type GameObject,
  Player,
  Rabbit,
  Raider,
  Stone,
  Tree,
  Wolf,
} from "../objects";

interface IGameSceneOptions {
  game: Game;
  group: Group | undefined;
  possibleActions: IGameSceneAction[];
}

export class GameScene {
  public id: string;
  public game: Game;
  public objects: GameObject[] = [];
  public group: Group | undefined;
  public raids: Raid[] = [];
  public events: Event[] = [];
  public possibleActions: IGameSceneAction[] = [];

  constructor({ game, group, possibleActions }: IGameSceneOptions) {
    this.id = createId();
    this.game = game;
    this.group = group;
    this.possibleActions = possibleActions;

    this.initSpawnFlags();
    this.initStaticFlags();
  }

  public async play() {
    return setInterval(() => {
      this.updateEvents();
      this.updateObjects();
      this.updateRaids();
    }, SERVER_TICK_MS);
  }

  destroy() {
    this.objects = [];
  }

  public async handleAction(
    action: IGameSceneAction,
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
    if (action === "START_CHANGING_SCENE") {
      // Admin only
      if (player.id !== ADMIN_PLAYER_ID) {
        return {
          ok: false,
          message: null,
        };
      }
      return this.startChangingSceneAction(player, params);
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
    if (action === "GIFT") {
      return this.giftAction(player, params);
    }
    if (action === "SELL") {
      return this.sellAction(player, params);
    }
    if (action === "BUY") {
      return this.buyAction(player, params);
    }

    return {
      ok: false,
      message: null,
    };
  }

  checkIfActionIsPossible(action: IGameSceneAction) {
    return this.possibleActions.find((a) => a === action);
  }

  initEvent({
    title,
    type,
    secondsToEnd,
    scene,
  }: {
    title: string;
    type: IGameEvent["type"];
    secondsToEnd: number;
    scene?: GameSceneType;
  }) {
    this.events.push(
      new Event({ game: this.game, title, type, secondsToEnd, scene }),
    );
  }

  getEvents(): IGameEvent[] {
    return this.events.map((event) => {
      return {
        id: event.id,
        title: event.title,
        type: event.type,
        status: event.status,
        endsAt: event.endsAt,
      };
    });
  }

  getInfo(): GetSceneResponse {
    return {
      id: this.id,
      commands: this.getAvailableCommands(),
      events: this.getEvents(),
      group: this.group,
    };
  }

  updateEvents() {
    for (const event of this.events) {
      const status = event.checkStatus();

      if (status === "STOPPED") {
        event.handleEnding();

        const index = this.events.indexOf(event);
        this.events.splice(index, 1);
      }
    }
  }

  updateObjects() {
    for (const obj of this.objects) {
      if (obj instanceof Player) {
        this.updatePlayer(obj);
      }
      if (obj instanceof Courier) {
        this.updateCourier(obj);
      }
      if (obj instanceof Rabbit) {
        this.updateRabbit(obj);
      }
      if (obj instanceof Wolf) {
        this.updateWolf(obj);
      }
      if (obj instanceof Tree) {
        this.updateTree(obj);
      }
      if (obj instanceof Stone) {
        this.updateStone(obj);
      }
      if (obj instanceof Raider) {
        this.updateRaider(obj);
      }
      if (obj instanceof Building) {
        this.updateBuilding(obj);
      }
      if (obj instanceof Flag) {
        this.updateFlag(obj);
      }
    }
  }

  updatePlayer(object: Player) {
    object.live();

    if (object.state === "IDLE") {
      const random = getRandomInRange(1, 800);
      if (random <= 1) {
        const randObj = this.getRandomFlag();
        if (!randObj) {
          return;
        }
        object.setTarget(randObj);
      }
    }
  }

  async updateCourier(object: Courier) {
    object.live();

    if (object.state === "MOVING") {
      const isMoving = object.move(1.5, 12);
      object.handleChange();

      if (!isMoving && object.target) {
        if (object.target instanceof Player) {
          await object.takeItemFromUnit("WOOD");
          await object.takeItemFromUnit("STONE");

          const warehouse = this.findStaticFlag("CENTER_FLAG");
          if (warehouse) {
            return object.setTarget(warehouse);
          }
        }
      }

      return;
    }

    if (object.state === "IDLE") {
      const playerWithWood = this.findUnitWithItem("WOOD");
      if (playerWithWood) {
        object.setTarget(playerWithWood);
        return;
      }

      const playerWithStone = this.findUnitWithItem("STONE");
      if (playerWithStone) {
        object.setTarget(playerWithStone);
        return;
      }

      const random = getRandomInRange(1, 100);
      if (random <= 1) {
        const randObj = this.getRandomFlag();
        if (!randObj) {
          return;
        }
        object.setTarget(randObj);
      }
    }
  }

  updateRabbit(object: Rabbit) {
    object.live();

    if (object.state === "IDLE") {
      const random = getRandomInRange(1, 100);
      if (random <= 1) {
        const randomObj = this.getRandomFlag();
        if (!randomObj) {
          return;
        }
        object.setTarget(randomObj);
      }
    }
  }

  updateWolf(object: Wolf) {
    object.live();

    if (object.state === "IDLE") {
      const random = getRandomInRange(1, 100);
      if (random <= 1) {
        const randomObj = this.getRandomFlag();
        if (!randomObj) {
          return;
        }
        object.setTarget(randomObj);
      }
    }
  }

  updateTree(object: Tree) {
    object.live();
  }

  updateStone(object: Stone) {
    object.live();
  }

  updateRaider(object: Raider) {
    object.live();
  }

  updateBuilding(object: Building) {
    object.live();
  }

  updateFlag(object: Flag) {
    object.live();
  }

  updateRaids() {
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
      if (action === "BUY") {
        commands.push("!купить [название]");
      }
      if (action === "SELL") {
        commands.push("!продать [название]");
      }
      if (action === "GIFT") {
        commands.push("!подарить [название]");
      }
      if (action === "DONATE") {
        commands.push("!донат");
      }
    }

    return commands;
  }

  async findOrCreatePlayer(id: string) {
    const player = this.findPlayer(id);
    if (!player && this.checkIfActionIsPossible("CREATE_NEW_PLAYER")) {
      return this.createPlayer(id);
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
    const instance = new Player({ id });
    await instance.init();
    await instance.initInventoryFromDB();

    const spawnFlag = this.findSpawnFlag("SPAWN_LEFT");
    if (spawnFlag) {
      instance.x = spawnFlag.x;
      instance.y = spawnFlag.y;
    }

    const centerFlag = this.findStaticFlag("CENTER_FLAG");
    if (centerFlag) {
      instance.target = centerFlag;
      instance.state = "MOVING";
    }

    return instance;
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

  startChangingSceneAction(_: Player, params?: string[]) {
    if (!this.checkIfActionIsPossible("START_CHANGING_SCENE")) {
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

    const scene = this.getSceneTypeFromChatCommand(params[1]);
    if (!scene) {
      return {
        ok: false,
        message: "Неверно указана цель. В деревню, на защиту.",
      };
    }

    this.initEvent({
      type: "SCENE_CHANGING_STARTED",
      title: "Меняем локацию",
      scene,
      secondsToEnd: 10,
    });

    return {
      ok: true,
      message: "Переходим в другую локацию...",
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

    const scene = this.getSceneTypeFromChatCommand(params[1]);
    if (!scene) {
      return {
        ok: false,
        message: "Неверно указана цель. В деревню, на защиту.",
      };
    }

    this.group = new Group({ creator: player, target: scene });

    this.initEvent({
      type: "GROUP_FORM_STARTED",
      title: "Идет набор в группу!",
      scene,
      secondsToEnd: 120,
    });

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
    const raid = new Raid({ raidersCount });
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

  public async giftAction(player: Player, params: string[] | undefined) {
    if (!this.checkIfActionIsPossible("GIFT")) {
      return {
        ok: false,
        message: null,
      };
    }

    if (!params) {
      return {
        ok: false,
        message: `${player.userName}, укажи конкретнее, например: !подарить древесину`,
      };
    }

    const item = this.getItemTypeFromChatCommand(params[0]);
    if (!item) {
      return {
        ok: false,
        message: `${player.userName}, укажи конкретнее, например: !подарить древесину`,
      };
    }

    const items = player.inventory?.items ?? [];

    if (item === "WOOD") {
      const itemExist = items.find((item) => item.type === "WOOD");
      if (!itemExist) {
        return {
          ok: false,
          message: `${player.userName}, у тебя нет древесины.`,
        };
      }

      await this.game.repository.addWoodToVillage(itemExist.amount);
      await player.addReputation(itemExist.amount);
      await player.inventory?.destroyItemInDB(itemExist.id);

      return {
        ok: true,
        message: `${player.userName}, ты подарил(а) деревне всю древесину! Твоя репутация возросла.`,
      };
    }
    if (item === "STONE") {
      const itemExist = items.find((item) => item.type === "STONE");
      if (!itemExist) {
        return {
          ok: false,
          message: `${player.userName}, у тебя нет камня.`,
        };
      }

      await this.game.repository.addStoneToVillage(itemExist.amount);
      await player.addReputation(itemExist.amount);
      await player.inventory?.destroyItemInDB(itemExist.id);

      return {
        ok: true,
        message: `${player.userName}, ты подарил(а) деревне все камни! Твоя репутация возросла.`,
      };
    }

    return {
      ok: false,
      message: `${player.userName}, укажи конкретнее, например: !подарить древесину`,
    };
  }

  async sellAction(player: Player, params: string[] | undefined) {
    if (!this.checkIfActionIsPossible("SELL")) {
      return {
        ok: false,
        message: null,
      };
    }

    if (!params) {
      return {
        ok: false,
        message: `${player.userName}, укажи конкретнее, например: !продать древесину`,
      };
    }

    const item = this.getItemTypeFromChatCommand(params[0]);
    if (!item) {
      return {
        ok: false,
        message: `${player.userName}, укажи конкретнее, например: !продать древесину`,
      };
    }

    const items = player.inventory?.items ?? [];

    if (item === "WOOD") {
      const itemExist = items.find((item) => item.type === "WOOD");
      if (!itemExist) {
        return {
          ok: false,
          message: `${player.userName}, у тебя нет древесины.`,
        };
      }

      await player.updateCoins(itemExist.amount);
      await player.inventory?.destroyItemInDB(itemExist.id);

      return {
        ok: true,
        message: `${player.userName}, ты продал(а) всю древесину торговцу!`,
      };
    }
    if (item === "STONE") {
      const itemExist = items.find((item) => item.type === "STONE");
      if (!itemExist) {
        return {
          ok: false,
          message: `${player.userName}, у тебя нет камня.`,
        };
      }

      await player.updateCoins(itemExist.amount);
      await player.inventory?.destroyItemInDB(itemExist.id);

      return {
        ok: true,
        message: `${player.userName}, ты продал(а) все камни торговцу!`,
      };
    }

    return {
      ok: false,
      message: `${player.userName}, укажи конкретнее, например: !продать древесину`,
    };
  }

  async buyAction(player: Player, params: string[] | undefined) {
    if (!this.checkIfActionIsPossible("BUY")) {
      return {
        ok: false,
        message: null,
      };
    }

    if (!params) {
      return {
        ok: false,
        message: `${player.userName}, укажи конкретнее, например: !купить топор`,
      };
    }

    const item = this.getItemTypeFromChatCommand(params[0]);
    if (!item) {
      return {
        ok: false,
        message: `${player.userName}, укажи конкретнее, например: !купить топор`,
      };
    }

    const items = player.inventory?.items ?? [];

    if (item === "AXE") {
      const itemExist = items.find((item) => item.type === "AXE");
      if (itemExist) {
        return {
          ok: false,
          message: `${player.userName}, у тебя уже есть топор.`,
        };
      }

      const result = await player.buyItemFromDealer("AXE", 10, 1);
      if (!result) {
        return {
          ok: false,
          message: `${player.userName}, неа.`,
        };
      }

      return {
        ok: true,
        message: `${player.userName}, ты купил(а) топор у торговца!`,
      };
    }
    if (item === "PICKAXE") {
      const itemExist = items.find((item) => item.type === "PICKAXE");
      if (itemExist) {
        return {
          ok: false,
          message: `${player.userName}, у тебя уже есть кирка.`,
        };
      }

      const result = await player.buyItemFromDealer("PICKAXE", 10, 1);
      if (!result) {
        return {
          ok: false,
          message: `${player.userName}, неа.`,
        };
      }

      return {
        ok: true,
        message: `${player.userName}, ты купил(а) кирку у торговца!`,
      };
    }

    return {
      ok: false,
      message: `${player.userName}, укажи конкретнее, например: !купить топор`,
    };
  }

  getItemTypeFromChatCommand(text: string): ItemType | null {
    if (text === "древесину" || text === "древесина") {
      return "WOOD";
    }
    if (text === "камень" || text === "камни") {
      return "STONE";
    }
    if (text === "топор") {
      return "AXE";
    }
    if (text === "кирка" || text === "кирку") {
      return "PICKAXE";
    }

    return null;
  }

  initSpawnFlags() {
    const spawnLeftFlag = new Flag({
      x: -100,
      y: 620,
      id: "SPAWN_LEFT",
      isOnScreen: false,
    });
    const spawnRightFlag = new Flag({
      x: 2700,
      y: 620,
      id: "SPAWN_RIGHT",
      isOnScreen: false,
    });
    this.objects.push(spawnLeftFlag, spawnRightFlag);
  }

  findSpawnFlag(id: "SPAWN_LEFT" | "SPAWN_RIGHT") {
    return this.objects.find((f) => f.id === id);
  }

  initStaticFlags() {
    const centerFlag = new Flag({
      x: 1270,
      y: 660,
      id: "CENTER_FLAG",
      isOnScreen: false,
    });
    this.objects.push(centerFlag);
  }

  findStaticFlag(id: "CENTER_FLAG") {
    return this.objects.find((f) => f.id === id);
  }

  findUnitWithItem(type: ItemType) {
    for (const object of this.objects) {
      if (object instanceof Player) {
        const item = object.inventory?.checkIfAlreadyHaveItem(type);
        if (item) {
          return object;
        }
      }
    }
  }
}
