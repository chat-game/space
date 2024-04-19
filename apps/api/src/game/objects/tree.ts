import { createId } from "@paralleldrive/cuid2";
import {
  type IGameObjectTree,
  getRandomInRange,
} from "../../../../../packages/api-sdk/src";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { GameObject } from "./gameObject";

interface ITreeOptions {
  id?: string;
  resource?: number;
  size?: number;
  health?: number;
  growSpeed?: number;
}

export class Tree extends GameObject implements IGameObjectTree {
  public type: IGameObjectTree["type"] = "1";
  public resource = 0;
  public size;
  public minSizeToChop = 75;
  public maxSize = 100;
  public growSpeed;
  public health;
  public isReadyToChop = false;
  public isReserved = false;

  constructor({ id, resource, size, health, growSpeed }: ITreeOptions) {
    const objectId = id ?? createId();

    const x = getRandomInRange(MIN_X, MAX_X);
    const y = getRandomInRange(MIN_Y, MAX_Y);

    super({ id: objectId, x, y, entity: "TREE" });

    this.state = "IDLE";
    this.resource = resource ?? getRandomInRange(1, 5);
    this.size = size ?? 100;
    this.health = health ?? 100;
    this.growSpeed = growSpeed ?? 0.01;
    this.type = this.getNewTreeType();
  }

  live() {
    this.checkHealth();

    switch (this.state) {
      case "IDLE":
        this.handleIdleState();
        break;
      case "CHOPPING":
        this.handleChoppingState();
        break;
      case "DESTROYED":
        break;
    }
  }

  checkHealth() {
    if (this.health <= 0) {
      this.destroy();
    }
  }

  handleChange() {
    this.sendMessageObjectUpdated();
  }

  handleIdleState() {
    this.grow();

    const random = getRandomInRange(1, 60);
    if (random <= 1) {
      this.handleChange();
    }
  }

  handleChoppingState() {
    const random = getRandomInRange(1, 20);
    if (random <= 1) {
      this.state = "IDLE";
      this.isReserved = false;
    }
  }

  grow() {
    if (this.size >= this.minSizeToChop && !this.isReadyToChop) {
      this.isReadyToChop = true;
    }
    if (this.size >= this.maxSize) {
      return;
    }

    this.size += this.growSpeed;
    this.handleChange();
  }

  public chop() {
    this.state = "CHOPPING";
    this.isReserved = true;
    this.health -= 0.08;
    this.handleChange();
  }

  destroy() {
    this.size = 0;
    this.health = 0;
    this.state = "DESTROYED";
    this.handleChange();
  }

  getNewTreeType(): IGameObjectTree["type"] {
    const types: IGameObjectTree["type"][] = ["1", "2", "3"];
    const index = getRandomInRange(0, types.length - 1);
    return types[index];
  }
}
