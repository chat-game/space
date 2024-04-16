import { Container } from "pixi.js";
import type { IGameObject } from "../../../../../packages/api-sdk/src";
import type { Game } from "../game";

interface IGameObjectContainerOptions extends IGameObject {
  game: Game;
}

export class GameObjectContainer extends Container implements IGameObject {
  public id: string;
  public state: IGameObject["state"];
  public direction: IGameObject["direction"];
  public entity: IGameObject["entity"];
  public target: IGameObject["target"];
  public health: IGameObject["health"];

  public game: Game;

  constructor({ game, ...object }: IGameObjectContainerOptions) {
    super();

    this.id = object.id;
    this.state = object.state;
    this.direction = object.direction;
    this.entity = object.entity;
    this.target = object.target;
    this.health = object.health;

    this.game = game;
  }

  animate(): void {}
}
