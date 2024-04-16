import type {
  GameObjectEntity,
  GameObjectTree,
  GameObject as IGameObject,
} from "../../../../../packages/api-sdk/src";
import { getRandomInRange } from "../../../../../packages/api-sdk/src";
import { MAX_X, MAX_Y, MIN_X, MIN_Y } from "../../config";
import { sendMessage } from "../../websocket/websocket.server";

export class GameObject implements IGameObject {
  public id: string;
  public x: number;
  public y: number;
  public entity: GameObjectEntity;
  public health = 100;

  public direction: IGameObject["direction"] = "RIGHT";
  public state: IGameObject["state"] = "IDLE";

  public target: GameObject | GameObjectTree | undefined;

  constructor(id: string, x: number, y: number) {
    this.id = id;
    this.x = x;
    this.y = y;
  }

  live(): void {}

  move(speed: number) {
    const isOnTarget = this.checkIfIsOnTarget();
    if (isOnTarget) {
      this.stop();
      return false;
    }

    if (!this.target || !this.target.x || !this.target.y) {
      this.stop();
      return false;
    }

    const distanceToX = this.getDistanceToTargetX();
    const distanceToY = this.getDistanceToTargetY();

    // Fix diagonal speed
    const finalSpeed =
      distanceToX > 0 && distanceToY > 0 ? speed * 0.75 : speed;

    this.moveX(finalSpeed > distanceToX ? distanceToX : finalSpeed);
    this.moveY(finalSpeed > distanceToY ? distanceToY : finalSpeed);
    return true;
  }

  moveX(speed: number) {
    if (!this.target?.x || this.target.x === this.x) {
      return;
    }

    if (this.x < this.target.x) {
      this.direction = "RIGHT";
      this.x += speed;
    }
    if (this.x > this.target.x) {
      this.x -= speed;
      this.direction = "LEFT";
    }
  }

  moveY(speed: number) {
    if (!this.target?.y || this.target.y === this.y) {
      return;
    }

    if (this.y < this.target.y) {
      this.y += speed;
    }
    if (this.y > this.target.y) {
      this.y -= speed;
    }
  }

  stop() {
    this.state = "IDLE";
  }

  checkIfIsOnTarget() {
    return this.x === this.target?.x && this.y === this.target?.y;
  }

  getDistanceToTargetX() {
    if (!this.target?.x) {
      return 0;
    }
    return Math.abs(this.target.x - this.x);
  }

  getDistanceToTargetY() {
    if (!this.target?.y) {
      return 0;
    }
    return Math.abs(this.target.y - this.y);
  }

  public setTarget(target: GameObject | GameObjectTree) {
    this.target = target;
    this.state = "MOVING";
  }

  public getRandomCoordinates(maxRange: number) {
    let newX = this.x + getRandomInRange(-maxRange, maxRange);
    if (newX < MIN_X) {
      newX = MIN_X + maxRange;
    }
    if (newX > MAX_X) {
      newX = MAX_X - maxRange;
    }

    let newY = this.y + getRandomInRange(-maxRange, maxRange);
    if (newY < MIN_Y) {
      newY = MIN_Y + maxRange;
    }
    if (newY > MAX_Y) {
      newY = MAX_Y - maxRange;
    }

    return { x: newX, y: newY };
  }

  public sendMessageObjectUpdated() {
    sendMessage("OBJECT_UPDATED", this);
  }
}
