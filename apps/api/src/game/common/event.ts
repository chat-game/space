import { createId } from "@paralleldrive/cuid2";
import {
  type EventStatus,
  type EventType,
  type IGameEvent,
  getDatePlusSeconds,
} from "../../../../../packages/api-sdk/src";

interface IEventOptions {
  type: EventType;
  secondsToEnd: number;
}

export class Event implements IGameEvent {
  public id: string;
  public type: EventType;
  public status: EventStatus;
  public endsAt: Date;
  public deletesAt: Date;

  constructor({ type, secondsToEnd }: IEventOptions) {
    this.id = createId();
    this.type = type;
    this.endsAt = getDatePlusSeconds(secondsToEnd);
    this.deletesAt = getDatePlusSeconds(secondsToEnd + 30);
    this.status = "STARTED";
  }

  public checkStatus() {
    if (this.endsAt.getTime() <= new Date().getTime()) {
      this.status = "STOPPED";
    }
    if (this.deletesAt.getTime() <= new Date().getTime()) {
      this.status = "STOPPED";
    }

    return this.status;
  }
}
