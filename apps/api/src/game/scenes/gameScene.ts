import { createId } from "@paralleldrive/cuid2";
import {
  type GameSceneType,
  type GetSceneResponse,
  type IGameChunk,
  type IGameEvent,
  type IGameObjectBuilding,
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
import { Forest, type GameChunk, Village } from "../chunks";
import { Event, Group } from "../common";
import type { Game } from "../game";
import {
  Building,
  Flag,
  type GameObject,
  Player,
  type Rabbit,
  Raider,
  type Stone,
  type Tree,
  Wagon,
  type Wolf,
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
  public events: Event[] = [];
  public chunks: GameChunk[] = [];
  public chunkNow: GameChunk | undefined;
  public possibleActions: IGameSceneAction[] = [];

  constructor({ game, group, possibleActions }: IGameSceneOptions) {
    this.id = createId();
    this.game = game;
    this.group = group;
    this.possibleActions = possibleActions;

    this.initSpawnFlags();
  }

  public async play() {
    return setInterval(() => {
      this.updateEvents();
      this.updateObjects();
      this.updateChunks();
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
    return this.events.map((event) => ({
      id: event.id,
      title: event.title,
      type: event.type,
      status: event.status,
      endsAt: event.endsAt,
    }));
  }

  getChunkNow(): IGameChunk | null {
    if (!this.chunkNow) {
      return null;
    }

    return {
      id: this.chunkNow.id,
      title: this.chunkNow.title,
      center: this.chunkNow.center,
      area: this.chunkNow.area,
      isVisibleOnClient: this.chunkNow.isVisibleOnClient,
    };
  }

  getInfo(): GetSceneResponse {
    return {
      id: this.id,
      commands: this.getAvailableCommands(),
      events: this.getEvents(),
      group: this.group,
      wagon: this.getWagon(),
      chunk: this.getChunkNow(),
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
      obj.isVisibleOnClient = this.checkIfPointIsOnWagonView({
        x: obj.x,
        y: obj.y,
      });

      if (obj instanceof Wagon) {
        this.updateWagon(obj);
        continue;
      }
      if (obj instanceof Player) {
        this.updatePlayer(obj);
        continue;
      }

      void obj.live();
    }
  }

  updateChunks() {
    for (const chunk of this.chunks) {
      chunk.isVisibleOnClient = this.checkIfPointIsOnWagonView({
        x: chunk.center.x,
        y: chunk.center.y,
      });

      const wagon = this.getWagon();

      const isWagonOnThisChunk = chunk.checkIfPointIsInArea({
        x: wagon.x,
        y: wagon.y,
      });
      if (isWagonOnThisChunk) {
        this.chunkNow = chunk;
      }

      chunk.live();
    }
  }

  getWagon() {
    return this.objects.find((obj) => obj instanceof Wagon) as Wagon;
  }

  checkIfPointIsOnWagonView(point: { x: number; y: number }) {
    const wagon = this.getWagon();
    if (!wagon) {
      return false;
    }

    if (point.x >= wagon.area.startX && point.x <= wagon.area.endX) {
      if (point.y >= wagon.area.startY && point.y <= wagon.area.endY) {
        return true;
      }
    }

    return false;
  }

  updateWagon(object: Wagon) {
    object.live();
  }

  updatePlayer(object: Player) {
    object.live();

    if (object.state === "IDLE") {
      const random = getRandomInRange(1, 120);
      if (random <= 1) {
        const randObj = this.findRandomNearWagonFlag();
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
        const randomObj = this.findRandomMovementFlag();
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
        const randomObj = this.findRandomMovementFlag();
        if (!randomObj) {
          return;
        }
        object.setTarget(randomObj);
      }
    }
  }

  updateRaider(object: Raider) {
    object.live();

    if (object.state === "IDLE") {
      const random = getRandomInRange(1, 100);
      if (random <= 1) {
        const randomObj = this.findRandomMovementFlag();
        if (!randomObj) {
          return;
        }
        object.setTarget(randomObj);
      }
    }

    if (object.state === "MOVING") {
      const isMoving = object.move(1);
      if (!isMoving) {
        if (object.target?.id === "SPAWN_RIGHT") {
          // Destroy
          const index = this.objects.indexOf(object);
          this.objects.splice(index, 1);
        }

        object.state = "IDLE";
        return;
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

    const wagon = this.getWagon();
    if (wagon) {
      instance.x = wagon.x - 250;
      instance.y = wagon.y;
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

  initRaiders(count: number) {
    for (let i = 0; i < count; i++) {
      this.objects.push(new Raider());
    }
  }

  public startRaidAction(raidersCount = 0) {
    this.initEvent({
      title: "Начался рейд!",
      type: "RAID_STARTED",
      secondsToEnd: 60 * 10,
    });
    this.initRaiders(raidersCount);

    return {
      ok: true,
      message: null,
    };
  }

  public stopRaid() {
    const flag = this.findSpawnFlag("SPAWN_RIGHT");
    if (!flag) {
      return;
    }

    for (const obj of this.objects) {
      if (obj instanceof Raider) {
        obj.moveOutOfScene(flag);
      }
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

  generateRandomVillage(center: { x: number; y: number }) {
    const village = new Village({ center });
    this.chunks.push(village);
  }

  generateRandomForest(center: { x: number; y: number }) {
    const forest = new Forest({ center });
    this.chunks.push(forest);
  }

  initWagonMovementFlags({
    startX,
    startY,
    endX,
    endY,
  }: {
    startX: number;
    startY: number;
    endX: number;
    endY: number;
  }) {
    const finalFlag = new Flag({ type: "WAGON_MOVEMENT", x: endX, y: endY });
    this.objects.push(finalFlag);
  }

  findRandomNearWagonFlag() {
    const wagon = this.getWagon();
    if (!wagon) {
      return undefined;
    }

    return wagon.nearFlags[Math.floor(Math.random() * wagon.nearFlags.length)];
  }

  findRandomMovementFlag() {
    const flags = this.objects.filter(
      (f) => f instanceof Flag && f.type === "MOVEMENT",
    );
    return flags.length > 0
      ? flags[Math.floor(Math.random() * flags.length)]
      : undefined;
  }

  findRandomEmptyResourceFlag() {
    const flags = this.objects.filter(
      (f) => f instanceof Flag && f.type === "RESOURCE" && !f.target,
    );
    return flags.length > 0
      ? flags[Math.floor(Math.random() * flags.length)]
      : undefined;
  }

  initSpawnFlags() {
    const spawnLeftFlag = new Flag({
      x: -100,
      y: 620,
      id: "SPAWN_LEFT",
      isOnScreen: false,
      type: "SPAWN_LEFT",
    });
    const spawnRightFlag = new Flag({
      x: 2700,
      y: 620,
      id: "SPAWN_RIGHT",
      isOnScreen: false,
      type: "SPAWN_RIGHT",
    });
    this.objects.push(spawnLeftFlag, spawnRightFlag);
  }

  findSpawnFlag(id: "SPAWN_LEFT" | "SPAWN_RIGHT") {
    return this.objects.find((f) => f.id === id);
  }

  findBuildingByType(type: IGameObjectBuilding["type"]) {
    const buildings = this.objects.filter((obj) => obj.entity === "BUILDING");
    for (const build of buildings) {
      if (build instanceof Building) {
        if (build.type === type) {
          return build;
        }
      }
    }
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
