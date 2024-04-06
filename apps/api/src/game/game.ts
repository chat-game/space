import { getRandomInRange } from "../../../../packages/api-sdk/src/lib/random";
import { DBRepository } from "../db/db.repository";
import { Flag, Player, Rabbit, Stone, Tree, Wolf } from "./objects";

const repository = new DBRepository();

export class Game {
  public players: Player[] = [];
  public trees: Tree[] = [];
  public stones: Stone[] = [];
  public rabbits: Rabbit[] = [];
  public wolfs: Wolf[] = [];
  public flags: Flag[] = [];

  public async init() {
    // this.players = await this.initPlayers();
    this.trees = await this.initTrees();
    this.stones = await this.initStones();
    this.rabbits = this.initRabbits(4);
    this.wolfs = this.initWolfs(2);
    this.flags = this.initFlags(8);
  }

  public async play() {
    // const activePlayers = [this.players[0], this.players[1]];

    return setInterval(() => {
      for (const tree of this.trees) {
        tree.live();
      }

      for (const stone of this.stones) {
        stone.live();
      }

      for (const rabbit of this.rabbits) {
        if (rabbit.state === "IDLE") {
          const random = getRandomInRange(1, 100);
          if (random <= 1) {
            const randomObj = this.getRandomFlag();
            if (!randomObj) {
              return;
            }
            rabbit.setTarget(randomObj);
          }
        }
        rabbit.live();
      }

      for (const wolf of this.wolfs) {
        if (wolf.state === "IDLE") {
          const random = getRandomInRange(1, 100);
          if (random <= 1) {
            const randomObj = this.getRandomFlag();
            if (!randomObj) {
              return;
            }
            wolf.setTarget(randomObj);
          }
        }
        wolf.live();
      }

      for (const player of this.players) {
        // if (player.state === "IDLE") {
        //   const random = getRandomInRange(1, 100);
        //   if (random <= 1) {
        //     const randObj = this.getRandomTree();
        //     if (!randObj) {
        //       return;
        //     }
        //     randObj.isReserved = true;
        //     player.setTarget(randObj);
        //   }
        // }
        player.live();
      }
    }, 25);
  }

  private async initTrees() {
    const trees = [];
    const treesFromDb = await repository.findTrees();
    for (const tree of treesFromDb) {
      const treeInstance = new Tree(tree.id);
      await treeInstance.readFromDB();
      trees.push(treeInstance);
    }
    return trees;
  }

  private async initStones() {
    const stones = [];
    const stonesFromDb = await repository.findStones();
    for (const stone of stonesFromDb) {
      const instance = new Stone(stone.id);
      await instance.readFromDB();
      stones.push(instance);
    }
    return stones;
  }

  private async initPlayer(id: string) {
    const instance = new Player(id);
    await instance.readFromDB();
    await instance.initInventory();
    await instance.initSkills();
    return instance;
  }

  private async initPlayers() {
    const players = [];
    const playersFromDb = await repository.findPlayers();
    for (const player of playersFromDb) {
      const instance = await this.initPlayer(player.id);
      players.push(instance);
    }
    return players;
  }

  private initRabbits(count: number) {
    const rabbits = [];
    for (let i = 0; i < count; i++) {
      rabbits.push(new Rabbit());
    }
    return rabbits;
  }

  private initWolfs(count: number) {
    const objects = [];
    for (let i = 0; i < count; i++) {
      objects.push(new Wolf());
    }
    return objects;
  }

  private initFlags(count: number) {
    const flags = [];
    for (let i = 0; i < count; i++) {
      flags.push(new Flag());
    }
    return flags;
  }

  getRandomTree() {
    const onlyReadyToChop = this.trees.filter(
      (tree) => tree.isReadyToChop && !tree.isReserved,
    );
    return onlyReadyToChop.length
      ? onlyReadyToChop[getRandomInRange(0, onlyReadyToChop.length - 1)]
      : undefined;
  }

  getRandomStone() {
    return this.stones.length
      ? this.stones[getRandomInRange(0, this.stones.length - 1)]
      : undefined;
  }

  getRandomFlag() {
    return this.flags[getRandomInRange(0, this.flags.length - 1)];
  }

  findPlayer(id: string) {
    return this.players.find((p) => p.id === id);
  }

  public async findOrCreatePlayer(twitchId: string, userName: string) {
    const playerInDB = await Player.findOrCreatePlayer(twitchId, userName);
    const id = playerInDB.id;
    const player = this.findPlayer(id);
    if (!player) {
      const instance = await this.initPlayer(id);
      this.players.push(instance);
      return instance;
    }
    return player;
  }

  public sendPlayerToChopATree(player: Player) {
    const randObj = this.getRandomTree();
    if (!randObj) {
      return false;
    }
    randObj.isReserved = true;
    player.setTarget(randObj);
    return true;
  }

  public sendPlayerToMineStone(player: Player) {
    const randObj = this.getRandomStone();
    if (!randObj) {
      return false;
    }
    player.setTarget(randObj);
    return true;
  }
}
