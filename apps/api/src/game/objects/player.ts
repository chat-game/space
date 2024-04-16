import { createId } from "@paralleldrive/cuid2";
import {
  type IGameObjectPlayer,
  type ItemType,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { db } from "../../db/db.client";
import { Inventory, Skill } from "../common";
import { GameObject } from "./gameObject";
import { Stone } from "./stone";
import { Tree } from "./tree";

export class Player extends GameObject implements IGameObjectPlayer {
  public readonly entity = "PLAYER";
  public coins = 0;
  public reputation = 0;
  public userName = "NPC";
  public colorIndex = 0;
  public health = 100;

  public inventoryId: string | null = null;
  public inventory: Inventory | null = null;

  public skills: Skill[] = [];

  constructor(id?: string) {
    const objectId = id ?? createId();

    const x = getRandomInRange(MIN_X, MAX_X);
    const y = getRandomInRange(MIN_Y, MAX_Y);

    super({ id: objectId, x, y });

    console.log(`Creating player ${objectId}!`);
  }

  live() {
    if (this.state === "IDLE") {
      this.handleChange();
      return;
    }

    if (this.state === "MOVING") {
      const isMoving = this.move(1);
      this.handleChange();

      if (!isMoving && this.target) {
        if (this.target instanceof Tree) {
          void this.startChopping();
          return;
        }
        if (this.target instanceof Stone) {
          void this.startMining();
          return;
        }
      }

      return;
    }

    if (this.state === "CHOPPING") {
      if (this.target instanceof Tree) {
        // Skill up on random
        const random = getRandomInRange(1, 200);
        if (random <= 1) {
          const skill = this.skills.find((skill) => skill.type === "WOODSMAN");
          if (skill) {
            void skill.addXp();
          }
        }

        // Check instrument
        const axe = this.inventory?.items.find((item) => item.type === "AXE");
        if (axe) {
          this.target.health -= 0.16;
          const random = getRandomInRange(1, 40);
          if (random <= 1) {
            void this.inventory?.checkAndBreakItem(axe, 1);
          }
        }

        this.target.chop();
        this.handleChange();

        if (this.target.health <= 0) {
          void this.stopChopping(this.target);
        }
      }

      return;
    }

    if (this.state === "MINING") {
      if (this.target instanceof Stone) {
        // Skill up on random
        const random = getRandomInRange(1, 200);
        if (random <= 1) {
          const skill = this.skills.find((skill) => skill.type === "MINER");
          if (skill) {
            void skill.addXp();
          }
        }

        // Check instrument
        const pickaxe = this.inventory?.items.find(
          (item) => item.type === "PICKAXE",
        );
        if (pickaxe) {
          this.target.health -= 0.16;
          const random = getRandomInRange(1, 40);
          if (random <= 1) {
            void this.inventory?.checkAndBreakItem(pickaxe, 1);
          }
        }

        this.target.mine();
        this.handleChange();

        if (this.target.health <= 0) {
          void this.stopMining(this.target);
        }
      }

      return;
    }
  }

  handleChange() {
    this.sendMessageObjectUpdated();
  }

  async startChopping() {
    this.state = "CHOPPING";
    this.direction = "RIGHT";

    const skill = this.skills.find((skill) => skill.type === "WOODSMAN");
    if (!skill) {
      await Skill.createInDB(this.id, "WOODSMAN");
      await this.initSkills();
    }

    await this.updateInDB();
    this.handleChange();
  }

  async stopChopping(tree: Tree) {
    this.state = "IDLE";
    // Reward
    if (this.inventory) {
      await this.inventory.addOrCreateItem("WOOD", tree.resource);
    }
    this.handleChange();
  }

  async startMining() {
    this.state = "MINING";
    this.direction = "RIGHT";

    const skill = this.skills.find((skill) => skill.type === "MINER");
    if (!skill) {
      await Skill.createInDB(this.id, "MINER");
      await this.initSkills();
    }

    await this.updateInDB();
    this.handleChange();
  }

  async stopMining(stone: Stone) {
    this.state = "IDLE";
    // Reward
    if (this.inventory) {
      await this.inventory.addOrCreateItem("STONE", stone.resource);
    }
    this.handleChange();
  }

  updateCoins(amount: number) {
    this.coins = this.coins + amount;
    this.handleChange();

    return db.player.update({
      where: { id: this.id },
      data: {
        coins: this.coins,
      },
    });
  }

  addReputation(amount: number) {
    this.reputation += amount;
    this.handleChange();

    return db.player.update({
      where: { id: this.id },
      data: {
        reputation: this.reputation,
      },
    });
  }

  addViewerPoints(increment: number) {
    return db.player.update({
      where: { id: this.id },
      data: {
        viewerPoints: { increment },
      },
    });
  }

  async buyItemFromDealer(type: ItemType, price: number, amount: number) {
    const item = await this.inventory?.tryGetItem(type);
    if (item) {
      return false;
    }

    if (this.coins < price) {
      return false;
    }

    await this.updateCoins(-price);
    await this.inventory?.addOrCreateItem(type, amount);
    this.handleChange();

    return true;
  }

  public async readFromDB() {
    const player = await db.player.findUnique({ where: { id: this.id } });
    if (!player) {
      return;
    }

    this.x = player.x;
    this.y = player.y;
    this.userName = player.userName;
    this.coins = player.coins;
    this.reputation = player.reputation;
    this.colorIndex = player.colorIndex;
    this.inventoryId = player.inventoryId;
  }

  public updateInDB() {
    return db.player.update({
      where: { id: this.id },
      data: {
        x: this.x,
        y: this.y,
        lastActionAt: new Date(),
      },
    });
  }

  public static createInDB({
    twitchId,
    userName,
    inventoryId,
    id,
  }: { twitchId: string; userName: string; inventoryId: string; id: string }) {
    const colorIndex = getRandomInRange(0, 360);
    return db.player.create({
      data: {
        id,
        twitchId,
        userName,
        x: -100,
        y: 600,
        colorIndex,
        inventoryId,
      },
    });
  }

  public static findByTwitchIdInDB(twitchId: string) {
    return db.player.findFirst({
      where: { twitchId },
    });
  }

  public static async findOrCreatePlayer(twitchId: string, userName: string) {
    const player = await Player.findByTwitchIdInDB(twitchId);
    if (!player) {
      const id = createId();
      const inventory = await Inventory.createInDB(id);
      return Player.createInDB({
        id,
        twitchId,
        userName,
        inventoryId: inventory.id,
      });
    }

    return player;
  }

  public async initInventory() {
    if (!this.inventoryId) {
      return;
    }

    const inventory = new Inventory({
      objectId: this.id,
      id: this.inventoryId,
    });
    await inventory.init();
    this.inventory = inventory;
  }

  public async initSkills() {
    this.skills = [];
    const skills = await Skill.findAllInDB(this.id);
    for (const skill of skills) {
      const instance = new Skill({ id: skill.id });
      await instance.init();
      this.skills.push(instance);
    }
  }
}
