import type { AnimatedSprite } from "pixi.js";
import type {
  IGameInventory,
  IGameObjectPlayer,
  IGameSkill,
} from "../../../../../packages/api-sdk/src";
import { GraphicsContainer } from "../components/graphicsContainer";
import { PlayerInterface } from "../components/playerInterface";
import type { Game } from "../game";
import { AssetsManager } from "../utils";
import { GameObjectContainer } from "./gameObjectContainer";

interface IPlayerOptions {
  game: Game;
  object: IGameObjectPlayer;
}

export class Player extends GameObjectContainer implements IGameObjectPlayer {
  coins!: number;
  reputation!: number;
  userName!: string;
  colorIndex!: number;
  inventory!: IGameInventory | null;
  skills!: IGameSkill[];

  children: GraphicsContainer[] = [];
  interface!: PlayerInterface;
  animationMovingLeft!: AnimatedSprite;
  animationMovingRight!: AnimatedSprite;

  constructor({ game, object }: IPlayerOptions) {
    super({ game, ...object });
    this.update(object);

    this.animationMovingLeft = AssetsManager.getAnimatedSpriteHeroLeft();
    this.animationMovingRight = AssetsManager.getAnimatedSpriteHeroRight();

    this.initInterface();
    this.init();
  }

  init() {
    const leftSpriteContainer = GraphicsContainer.createWithSprite(
      "playerLeft",
      "LEFT",
      "PLAYER_IDLE_LEFT",
    );
    const rightSpriteContainer = GraphicsContainer.createWithSprite(
      "playerRight",
      "RIGHT",
      "PLAYER_IDLE_RIGHT",
    );

    const topLeftSpriteContainer = GraphicsContainer.createWithSprite(
      "playerTopLeft",
      "LEFT",
      "PLAYER_TOP_LEFT",
    );
    GraphicsContainer.addFiltersToPlayersTop(
      topLeftSpriteContainer,
      this.colorIndex,
    );

    const topRightSpriteContainer = GraphicsContainer.createWithSprite(
      "playerTopRight",
      "RIGHT",
      "PLAYER_TOP_RIGHT",
    );
    GraphicsContainer.addFiltersToPlayersTop(
      topRightSpriteContainer,
      this.colorIndex,
    );

    this.addChild(
      leftSpriteContainer,
      topLeftSpriteContainer,
      rightSpriteContainer,
      topRightSpriteContainer,
      this.animationMovingLeft,
      this.animationMovingRight,
      this.interface,
    );
  }

  initInterface() {
    this.interface = new PlayerInterface(this);
  }

  animate() {
    for (const container of this.children) {
      container.visible = false;

      if (this.state === "MOVING") {
        if (this.direction === "RIGHT") {
          this.animationMovingRight.animationSpeed = 0.25;
          this.animationMovingRight.visible = true;
          this.animationMovingRight.play();

          if (container.type === "PLAYER_TOP_RIGHT") {
            container.visible = true;
          }
        }
        if (this.direction === "LEFT") {
          this.animationMovingLeft.animationSpeed = 0.25;
          this.animationMovingLeft.visible = true;
          this.animationMovingLeft.play();

          if (container.type === "PLAYER_TOP_LEFT") {
            container.visible = true;
          }
        }
      }

      if (
        this.state === "IDLE" ||
        this.state === "CHOPPING" ||
        this.state === "MINING"
      ) {
        if (this.direction === "LEFT") {
          if (container.type === "PLAYER_IDLE_LEFT") {
            container.visible = true;
          }
          if (container.type === "PLAYER_TOP_LEFT") {
            container.visible = true;
          }
        }
        if (this.direction === "RIGHT") {
          if (container.type === "PLAYER_IDLE_RIGHT") {
            container.visible = true;
          }
          if (container.type === "PLAYER_TOP_RIGHT") {
            container.visible = true;
          }
        }
      }
    }

    this.interface.animate();
    this.showToolInHand();
    this.handleSoundByState();
  }

  showToolInHand() {
    let interfaceContainer: PlayerInterface | undefined;

    for (const container of this.children) {
      if (container instanceof PlayerInterface) {
        interfaceContainer = container;
      }
    }

    if (!interfaceContainer) {
      return;
    }

    if (this.state === "CHOPPING") {
      interfaceContainer.showAxeInHand();
    }
    if (this.state === "MINING") {
      interfaceContainer.showPickaxeInHand();
    }
  }

  handleSoundByState() {
    if (this.state === "CHOPPING") {
      if (this.inventory?.items.find((item) => item.type === "AXE")) {
        this.game.audio.playChopWithAxeSound();
        return;
      }

      this.game.audio.playHandPunch();
    }

    if (this.state === "MINING") {
      if (this.inventory?.items.find((item) => item.type === "PICKAXE")) {
        this.game.audio.playMineWithPickaxeSound();
        return;
      }

      this.game.audio.playHandPunch();
    }
  }

  update(object: IGameObjectPlayer) {
    this.x = object.x;
    this.y = object.y;
    this.zIndex = Math.round(object.y + 1);

    this.entity = object.entity;
    this.state = object.state;
    this.direction = object.direction;

    this.coins = object.coins;
    this.reputation = object.reputation;
    this.userName = object.userName;
    this.colorIndex = object.colorIndex;
    this.inventory = object.inventory;
    this.skills = object.skills;

    this.health = object.health;
  }
}
