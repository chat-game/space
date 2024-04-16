import { Container } from "pixi.js";
import type {
  IGameObject,
  IGameObjectPlayer,
  IGameObjectRabbit,
  IGameObjectRaider,
  IGameObjectStone,
  IGameObjectTree,
  IGameObjectWolf,
  WebSocketMessage,
} from "../../../../packages/api-sdk/src";
import { addBackground } from "./addBackground";
import {
  type GameObjectContainer,
  Player,
  Rabbit,
  Raider,
  Stone,
  Tree,
  Wolf,
} from "./objects";
import {
  AssetsManager,
  AudioManager,
  SceneManager,
  WebSocketManager,
} from "./utils";

export interface GameOptions {
  viewWidth: number;
  viewHeight: number;
}

export class Game extends Container {
  public children: GameObjectContainer[] = [];
  public audio: AudioManager;
  public scene: SceneManager;

  public viewWidth: number;
  public viewHeight: number;

  constructor(options: GameOptions) {
    super();

    this.viewWidth = options.viewWidth;
    this.viewHeight = options.viewHeight;

    this.audio = new AudioManager();
    this.scene = new SceneManager();
  }

  handleResize({
    viewWidth,
    viewHeight,
  }: {
    viewWidth: number;
    viewHeight: number;
  }) {
    console.log(viewWidth, viewHeight);
  }

  async play() {
    await AssetsManager.init();

    this.audio.playBackgroundSound();

    addBackground(this.scene.app);

    this.scene.app.stage.addChild(this);

    this.scene.app.ticker.add(() => {
      this.animateObjects();
    });

    WebSocketManager.init(this);
  }

  rebuildScene() {
    this.children = [];
  }

  findObject(id: string) {
    return this.children.find((obj) => obj.id === id);
  }

  initTree(object: IGameObjectTree) {
    const tree = new Tree({ game: this, object });
    this.addChild(tree);
  }

  updateTree(object: IGameObjectTree) {
    const tree = this.findObject(object.id);
    if (tree instanceof Tree) {
      tree.update(object);
    }
  }

  initStone(object: IGameObjectStone) {
    const stone = new Stone({ game: this, object });
    this.addChild(stone);
  }

  updateStone(object: IGameObjectStone) {
    const stone = this.findObject(object.id);
    if (stone instanceof Stone) {
      stone.update(object);
    }
  }

  initPlayer(object: IGameObjectPlayer) {
    const player = new Player({ game: this, object });
    this.addChild(player);
  }

  updatePlayer(object: IGameObjectPlayer) {
    const player = this.findObject(object.id);
    if (player instanceof Player) {
      player.update(object);
    }
  }

  initRaider(object: IGameObjectRaider) {
    const raider = new Raider({ game: this, object });
    this.addChild(raider);
  }

  updateRaider(object: IGameObjectRaider) {
    const raider = this.findObject(object.id);
    if (raider instanceof Raider) {
      raider.update(object);
    }
  }

  initRabbit(object: IGameObjectRabbit) {
    const rabbit = new Rabbit({ game: this, object });
    this.addChild(rabbit);
  }

  updateRabbit(object: IGameObjectRabbit) {
    const rabbit = this.findObject(object.id);
    if (rabbit instanceof Rabbit) {
      rabbit.update(object);
    }
  }

  initWolf(object: IGameObjectWolf) {
    const wolf = new Wolf({ game: this, object });
    this.addChild(wolf);
  }

  updateWolf(object: IGameObjectWolf) {
    const wolf = this.findObject(object.id);
    if (wolf instanceof Wolf) {
      wolf.update(object);
    }
  }

  animateObjects() {
    for (const object of this.children) {
      object.animate();
    }
  }

  handleMessage(message: WebSocketMessage) {
    if (message.object) {
      this.handleMessageObject(message.object);
    }
    if (message.event) {
      this.handleMessageEvent(message.event);
    }
  }

  handleMessageObject(object: IGameObject) {
    const obj = this.findObject(object.id);
    if (!obj) {
      if (object.entity === "TREE") {
        this.initTree(object as IGameObjectTree);
        return;
      }
      if (object.entity === "STONE") {
        this.initStone(object as IGameObjectStone);
        return;
      }
      if (object.entity === "PLAYER") {
        this.initPlayer(object as IGameObjectPlayer);
        return;
      }
      if (object.entity === "RAIDER") {
        this.initRaider(object as IGameObjectRaider);
        return;
      }
      if (object.entity === "RABBIT") {
        this.initRabbit(object as IGameObjectRabbit);
        return;
      }
      if (object.entity === "WOLF") {
        this.initWolf(object as IGameObjectWolf);
        return;
      }
      return;
    }

    if (object.entity === "TREE") {
      this.updateTree(object as IGameObjectTree);
      return;
    }
    if (object.entity === "STONE") {
      this.updateStone(object as IGameObjectStone);
      return;
    }
    if (object.entity === "PLAYER") {
      this.updatePlayer(object as IGameObjectPlayer);
      return;
    }
    if (object.entity === "RAIDER") {
      this.updateRaider(object as IGameObjectRaider);
      return;
    }
    if (object.entity === "RABBIT") {
      this.updateRabbit(object as IGameObjectRabbit);
      return;
    }
    if (object.entity === "WOLF") {
      this.updateWolf(object as IGameObjectWolf);
      return;
    }
  }

  handleMessageEvent(event: WebSocketMessage["event"]) {
    if (event === "RAID_STARTED") {
      this.audio.playRaidSound();
    }
    if (event === "GROUP_FORM_STARTED") {
      this.audio.playRaidSound();
    }
    if (event === "SCENE_CHANGED") {
      this.rebuildScene();
    }
  }
}
