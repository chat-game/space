import { createId } from "@paralleldrive/cuid2";
import type { IGameObjectWagon } from "../../../../../packages/api-sdk/src";
import { Flag } from "./flag";
import { GameObject } from "./gameObject";

interface IWagonOptions {
  x: number;
  y: number;
}

export class Wagon extends GameObject implements IGameObjectWagon {
  public speed: number;
  public area!: IGameObjectWagon["area"];

  public nearFlags: Flag[] = [];

  constructor({ x, y }: IWagonOptions) {
    const finalId = createId();

    super({ id: finalId, x, y, entity: "WAGON", isVisibleOnClient: true });

    this.speed = 0;
    this.updateArea();
    this.initNearFlags();
  }

  live() {
    this.updateArea();
    this.updateNearFlags();

    if (this.state === "IDLE") {
      this.handleChange();
      return;
    }

    if (this.state === "MOVING") {
      this.speed = 0.5;

      const isMoving = this.move(this.speed);
      this.handleChange();

      if (!isMoving) {
        this.state = "IDLE";
        this.speed = 0;
      }

      return;
    }
  }

  handleChange() {
    this.sendMessageObjectUpdated();
  }

  updateArea() {
    this.area = {
      startX: this.x - 3000,
      endX: this.x + 3000,
      startY: this.y - 1500,
      endY: this.y + 1500,
    };
  }

  initNearFlags() {
    const flag1 = new Flag({
      type: "WAGON_NEAR_MOVEMENT",
      x: this.x - 300,
      y: this.y,
      offsetX: -300,
      offsetY: 0,
    });
    const flag2 = new Flag({
      type: "WAGON_NEAR_MOVEMENT",
      x: this.x - 100,
      y: this.y + 150,
      offsetX: -100,
      offsetY: 150,
    });
    const flag3 = new Flag({
      type: "WAGON_NEAR_MOVEMENT",
      x: this.x + 200,
      y: this.y + 150,
      offsetX: 200,
      offsetY: 150,
    });
    this.nearFlags.push(flag1, flag2, flag3);
  }

  updateNearFlags() {
    for (const nearFlag of this.nearFlags) {
      nearFlag.x = this.x + nearFlag.offsetX;
      nearFlag.y = this.y + nearFlag.offsetY;
    }
  }
}
