import { Graphics, Sprite, Text } from "pixi.js";
import type { IGameObjectPlayer } from "../../../../../packages/api-sdk/src";
import { GraphicsContainer } from "./graphicsContainer";

export class PlayerInterface extends GraphicsContainer {
  public children: GraphicsContainer[] = [];
  public player: IGameObjectPlayer;

  public coins = 0;
  public wood = 0;
  public stone = 0;

  public showInHandItemIndex = 0;
  public showInHandTimerSeconds = 0;
  public showToolTimerSeconds = 0;
  public showWood = false;
  public showStone = false;

  public haveAxe = false;
  public showAxe = false;
  public havePickaxe = false;
  public showPickaxe = false;

  constructor(player: IGameObjectPlayer) {
    super("INTERFACE");

    this.x = -15;
    this.y = 5;

    this.player = player;

    this.init();
  }

  init() {
    this.coins = this.player.coins;
    this.wood =
      this.player.inventory?.items.find((item) => item.type === "WOOD")
        ?.amount ?? 0;
    this.stone =
      this.player.inventory?.items.find((item) => item.type === "STONE")
        ?.amount ?? 0;

    this.haveAxe = !!this.player.inventory?.items.find(
      (item) => item.type === "AXE",
    );
    this.havePickaxe = !!this.player.inventory?.items.find(
      (item) => item.type === "PICKAXE",
    );

    this.drawUserName(this.player.userName);
    this.drawCoins(this.coins);
    this.drawWood(this.wood);
    this.drawStone();
    this.drawAxe();
    this.drawPickaxe();

    this.setShowInHandTimer();
    this.setShowToolTimer();
  }

  rebuild() {
    this.children = [];

    this.drawUserName(this.player.userName);
    this.drawCoins(this.coins);
    this.drawWood(this.wood);
    this.drawStone();
    this.drawAxe();
    this.drawPickaxe();
    this.showInHandTimerSeconds = 0;
  }

  update() {
    const wood =
      this.player.inventory?.items.find((item) => item.type === "WOOD")
        ?.amount ?? 0;
    const stone =
      this.player.inventory?.items.find((item) => item.type === "STONE")
        ?.amount ?? 0;
    const haveAxe = !!this.player.inventory?.items.find(
      (item) => item.type === "AXE",
    );
    const havePickaxe = !!this.player.inventory?.items.find(
      (item) => item.type === "PICKAXE",
    );

    if (
      this.player.coins !== this.coins ||
      wood !== this.wood ||
      stone !== this.stone ||
      haveAxe !== this.haveAxe ||
      havePickaxe !== this.havePickaxe
    ) {
      this.coins = this.player.coins;
      this.wood = wood;
      this.stone = stone;
      this.haveAxe = haveAxe;
      this.havePickaxe = havePickaxe;
      this.rebuild();
    }

    this.coins = this.player.coins;
    this.wood = wood;
    this.stone = stone;
    this.haveAxe = haveAxe;
    this.havePickaxe = havePickaxe;
  }

  animate() {
    this.visible = true;
    this.update();

    for (const container of this.children) {
      container.visible = true;

      if (container.type === "PLAYER_COINS") {
        if (!this.coins) {
          container.visible = false;
        }
      }

      if (container.type === "PLAYER_WOOD") {
        if (this.wood <= 0 || !this.showWood) {
          container.visible = false;
        }
      }

      if (container.type === "PLAYER_STONE") {
        if (this.stone <= 0 || !this.showStone) {
          container.visible = false;
        }
      }

      if (container.type === "PLAYER_AXE") {
        if (!this.haveAxe || !this.showAxe) {
          container.visible = false;
        }
      }

      if (container.type === "PLAYER_PICKAXE") {
        if (!this.havePickaxe || !this.showPickaxe) {
          container.visible = false;
        }
      }
    }
  }

  drawUserName(userName: string) {
    const container = new GraphicsContainer("INTERFACE");

    const basicText = new Text({
      text: userName,
      style: {
        fontSize: 14,
        fill: 0x694f62,
        align: "center",
      },
    });

    const graphics = new Graphics();
    graphics.roundRect(-6, -2, basicText.width + 12, basicText.height + 4, 8);
    graphics.fill(0xffffff);

    container.addChild(graphics, basicText);

    container.x = -container.width / 2 + 24;
    container.y = -84;

    this.addChild(container);
  }

  drawCoins(coins: number) {
    const container = new GraphicsContainer("PLAYER_COINS");

    const basicText = new Text({
      text: coins,
      style: {
        fontSize: 11,
        fill: 0xca8a04,
        align: "center",
      },
    });

    const graphics = new Graphics();
    graphics.roundRect(-5, -4, basicText.width + 10, basicText.height + 8, 10);
    graphics.fill(0xfef08a);

    container.addChild(graphics, basicText);

    container.x = 45;
    container.y = -60;

    this.addChild(container);
  }

  drawWood(wood: number) {
    const container = new GraphicsContainer("PLAYER_WOOD");

    const woodSprite = Sprite.from("wood1");
    woodSprite.width = 32;
    woodSprite.height = 32;

    const basicText = new Text({
      text: wood,
      style: {
        fontSize: 12,
        fill: 0xfef3c7,
        align: "left",
      },
    });

    basicText.x = 6;
    basicText.y = 16;

    container.addChild(woodSprite, basicText);

    container.x = -18;
    container.y = -48;

    this.addChild(container);
  }

  drawStone() {
    const container = new GraphicsContainer("PLAYER_STONE");

    const woodSprite = Sprite.from("stoneRes1");
    woodSprite.width = 32;
    woodSprite.height = 32;

    const basicText = new Text({
      text: this.stone,
      style: {
        fontSize: 12,
        fill: 0xfef3c7,
        align: "left",
      },
    });

    basicText.x = 6;
    basicText.y = 16;

    container.addChild(woodSprite, basicText);

    container.x = -18;
    container.y = -48;

    this.addChild(container);
  }

  drawAxe() {
    const container = new GraphicsContainer("PLAYER_AXE");

    const sprite = Sprite.from("toolAxe1");
    sprite.width = 64;
    sprite.height = 64;

    container.addChild(sprite);

    container.x = -10;
    container.y = -68;

    this.addChild(container);
  }

  drawPickaxe() {
    const container = new GraphicsContainer("PLAYER_PICKAXE");

    const sprite = Sprite.from("toolPickaxe1");
    sprite.width = 64;
    sprite.height = 64;

    container.addChild(sprite);

    container.x = -10;
    container.y = -68;

    this.addChild(container);
  }

  showWoodInHand() {
    this.showWood = true;
  }

  showStoneInHand() {
    this.showStone = true;
  }

  showAxeInHand() {
    this.showAxe = true;
    this.showToolTimerSeconds = 5;
  }

  showPickaxeInHand() {
    this.showPickaxe = true;
    this.showToolTimerSeconds = 5;
  }

  setShowInHandTimer() {
    return setInterval(() => {
      if (this.showInHandTimerSeconds <= 0) {
        this.showNextItem();
        return;
      }

      this.showInHandTimerSeconds -= 1;
    }, 1000);
  }

  setShowToolTimer() {
    return setInterval(() => {
      if (this.showToolTimerSeconds <= 0) {
        this.showAxe = false;
        this.showPickaxe = false;
        return;
      }

      this.showToolTimerSeconds -= 1;
    });
  }

  getResourcesArray() {
    return this.player.inventory?.items.filter(
      (item) => item.type === "WOOD" || item.type === "STONE",
    );
  }

  showNextItem() {
    const items = this.getResourcesArray();
    if (!items) {
      return;
    }

    if (items.length < this.showInHandItemIndex + 1) {
      this.showInHandItemIndex = 0;
    }

    this.showWood = false;
    this.showStone = false;
    this.showInHandTimerSeconds = 5;

    switch (items[this.showInHandItemIndex].type) {
      case "WOOD":
        this.showWoodInHand();
        break;
      case "STONE":
        this.showStoneInHand();
        break;
    }

    this.showInHandItemIndex += 1;
  }
}
