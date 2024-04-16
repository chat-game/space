import { Container } from "pixi.js";
import type {
  GameObject,
  GameObjectPlayer,
  GameObjectRaider,
  GameObjectStone,
  GameObjectTree,
  WebSocketMessage,
} from "../../../../packages/api-sdk/src";
import { addBackground } from "./addBackground";
import {
  type GameContainer,
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
  public children: GameContainer[] = [];
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

  initTree(object: GameObjectTree) {
    const tree = new Tree(this, object);
    this.addChild(tree);
  }

  updateTree(object: GameObjectTree) {
    const tree = this.findObject(object.id);
    if (tree instanceof Tree) {
      tree.update(object);
    }
  }

  initStone(object: GameObjectStone) {
    const stone = new Stone(this, object);
    this.addChild(stone);
  }

  updateStone(object: GameObjectStone) {
    const stone = this.findObject(object.id);
    if (stone instanceof Stone) {
      stone.update(object);
    }
  }

  initPlayer(object: GameObjectPlayer) {
    const player = new Player(this, object);
    this.addChild(player);
  }

  updatePlayer(object: GameObjectPlayer) {
    const player = this.findObject(object.id);
    if (player instanceof Player) {
      player.update(object);
    }
  }

  initRaider(object: GameObjectRaider) {
    const raider = new Raider(this, object);
    this.addChild(raider);
  }

  updateRaider(object: GameObjectRaider) {
    const raider = this.findObject(object.id);
    if (raider instanceof Raider) {
      raider.update(object);
    }
  }

  initRabbit(object: GameObject) {
    const rabbit = new Rabbit(this, object);
    this.addChild(rabbit);
  }

  updateRabbit(object: GameObject) {
    const rabbit = this.findObject(object.id);
    if (rabbit instanceof Rabbit) {
      rabbit.update(object);
    }
  }

  initWolf(object: GameObject) {
    const wolf = new Wolf(this, object);
    this.addChild(wolf);
  }

  updateWolf(object: GameObject) {
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

  handleMessageObject(object: GameObject) {
    const obj = this.findObject(object.id);
    if (!obj) {
      if (object.entity === "TREE") {
        this.initTree(object as GameObjectTree);
        return;
      }
      if (object.entity === "STONE") {
        this.initStone(object as GameObjectStone);
        return;
      }
      if (object.entity === "PLAYER") {
        this.initPlayer(object as GameObjectPlayer);
        return;
      }
      if (object.entity === "RAIDER") {
        this.initRaider(object as GameObjectRaider);
        return;
      }
      if (object.entity === "RABBIT") {
        this.initRabbit(object as GameObject);
        return;
      }
      if (object.entity === "WOLF") {
        this.initWolf(object as GameObject);
        return;
      }
      return;
    }

    if (object.entity === "TREE") {
      this.updateTree(object as GameObjectTree);
      return;
    }
    if (object.entity === "STONE") {
      this.updateStone(object as GameObjectStone);
      return;
    }
    if (object.entity === "PLAYER") {
      this.updatePlayer(object as GameObjectPlayer);
      return;
    }
    if (object.entity === "RAIDER") {
      this.updateRaider(object as GameObjectRaider);
      return;
    }
    if (object.entity === "RABBIT") {
      this.updateRabbit(object as GameObject);
      return;
    }
    if (object.entity === "WOLF") {
      this.updateWolf(object as GameObject);
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
