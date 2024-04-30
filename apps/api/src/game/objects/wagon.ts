import { createId } from "@paralleldrive/cuid2";
import type { IGameObjectWagon } from "../../../../../packages/api-sdk/src";
import { Flag } from "./flag";
import { GameObject } from "./gameObject";
import { Mechanic } from "./units/mechanic";

interface IWagonOptions {
  x: number;
  y: number;
}

export class Wagon extends GameObject implements IGameObjectWagon {
  public speed: number;
  public visibilityArea!: IGameObjectWagon["visibilityArea"];

  public mechanic!: Mechanic;
  public serverDataArea!: IGameObjectWagon["visibilityArea"];
  public nearFlags: Flag[] = [];

  constructor({ x, y }: IWagonOptions) {
    const finalId = createId();

    super({ id: finalId, x, y, entity: "WAGON", isVisibleOnClient: true });

    this.speed = 0;
    this.updateVisibilityArea();
    this.updateServerDataArea();
    this.initNearFlags();
    this.initMechanic();
  }

  live() {
    this.updateVisibilityArea();
    this.updateServerDataArea();
    this.updateNearFlags();
    this.updateMechanic();

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

  updateVisibilityArea() {
    const offsetX = 2560 / 2;
    const offsetY = 1440 / 2;

    this.visibilityArea = {
      startX: this.x - offsetX,
      endX: this.x + offsetX,
      startY: this.y - offsetY,
      endY: this.y + offsetY,
    };
  }

  updateServerDataArea() {
    const offsetX = 2560 * 1.5;
    const offsetY = 1440;

    this.serverDataArea = {
      startX: this.x - offsetX,
      endX: this.x + offsetX,
      startY: this.y - offsetY,
      endY: this.y + offsetY,
    };
  }

  initMechanic() {
    this.mechanic = new Mechanic({ x: this.x, y: this.y });
  }

  updateMechanic() {
    this.mechanic.isVisibleOnClient = true;
    this.mechanic.needToSendDataToClient = true;
    this.mechanic.live();
    this.mechanic.direction = "LEFT";
    this.mechanic.x = this.x - 50;
    this.mechanic.y = this.y - 48;
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
