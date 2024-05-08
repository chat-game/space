import { Container } from "pixi.js";
import type {
  IGameObject
} from "../../../../../packages/api-sdk/src";
import type { Game } from "../game";

interface IGameObjectContainerOptions extends IGameObject {
  game: Game;
}

export class GameObjectContainer extends Container implements IGameObject {
  public id!: string;
  public state!: IGameObject["state"];
  public direction!: IGameObject["direction"];
  public entity!: IGameObject["entity"];
  public target: IGameObject["target"];
  public health!: IGameObject["health"];
  public isVisibleOnClient!: IGameObject["isVisibleOnClient"];

  public game: Game;

  constructor({ game, ...object }: IGameObjectContainerOptions) {
    super();

    this.game = game;
    this.update(object);
  }

  animate(): void {}

  update(object: IGameObject) {
    this.x = object.x;
    this.y = object.y;
    this.zIndex = Math.round(object.y);

    this.id = object.id;
    this.entity = object.entity;
    this.state = object.state;
    this.direction = object.direction;
    this.health = object.health;
    this.target = object.target;
    this.isVisibleOnClient = object.isVisibleOnClient;
  }
}
