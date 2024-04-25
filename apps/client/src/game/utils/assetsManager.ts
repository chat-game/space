import { AnimatedSprite, Assets, Sprite, Texture, TilingSprite } from "pixi.js";
import { getRandomInRange } from "../../../../../packages/api-sdk/src";
import heroLeft1 from "../assets/images/animation/hero-moving-left/1.png";
import heroLeft2 from "../assets/images/animation/hero-moving-left/2.png";
import heroLeft3 from "../assets/images/animation/hero-moving-left/3.png";
import heroLeft4 from "../assets/images/animation/hero-moving-left/4.png";
import heroLeft5 from "../assets/images/animation/hero-moving-left/5.png";
import heroLeft6 from "../assets/images/animation/hero-moving-left/6.png";
import heroRight1 from "../assets/images/animation/hero-moving-right/1.png";
import heroRight2 from "../assets/images/animation/hero-moving-right/2.png";
import heroRight3 from "../assets/images/animation/hero-moving-right/3.png";
import heroRight4 from "../assets/images/animation/hero-moving-right/4.png";
import heroRight5 from "../assets/images/animation/hero-moving-right/5.png";
import heroRight6 from "../assets/images/animation/hero-moving-right/6.png";
import background1 from "../assets/images/background/1.png";
import background2 from "../assets/images/background/2.png";
import background3 from "../assets/images/background/3.png";
import background4 from "../assets/images/background/4.png";
import background5 from "../assets/images/background/5.png";
import generatedBackground1 from "../assets/images/background/generated-1.png";
import campFire1 from "../assets/images/camp-fire-1.png";
import flag1 from "../assets/images/objects/flag-1.png";
import flag2 from "../assets/images/objects/flag-2.png";
import stone1 from "../assets/images/objects/stone-1.png";
import tree1 from "../assets/images/objects/tree-1.png";
import tree2 from "../assets/images/objects/tree-2.png";
import tree3 from "../assets/images/objects/tree-3.png";
import blackTopLeft from "../assets/images/top/black-top-left.png";
import blackTopRight from "../assets/images/top/black-top-right.png";
import blueTopLeft from "../assets/images/top/blue-top-left.png";
import blueTopRight from "../assets/images/top/blue-top-right.png";
import greenTopLeft from "../assets/images/top/green-top-left.png";
import greenTopRight from "../assets/images/top/green-top-right.png";
import violetTopLeft from "../assets/images/top/violet-top-left.png";
import violetTopRight from "../assets/images/top/violet-top-right.png";
import unitHairClassicLeft from "../assets/images/unit/hair-classic-left.png";
import unitHairClassicRight from "../assets/images/unit/hair-classic-right.png";
import unitHead1Left from "../assets/images/unit/head-1-left.png";
import unitHead1Right from "../assets/images/unit/head-1-right.png";
import wagonEngine1 from "../assets/images/wagon/engine-1.png";
import wagonBase1 from "../assets/images/wagon/wagon-1.png";
import wagonBase2 from "../assets/images/wagon/wagon-2.png";
import wagonWheel1 from "../assets/images/wagon/wheel-1.png";
import warehouse1 from "../assets/images/warehouse-1.png";

export abstract class AssetsManager {
  static assets = [
    { alias: "background1", src: background1 },
    { alias: "background2", src: background2 },
    { alias: "background3", src: background3 },
    { alias: "background4", src: background4 },
    { alias: "background5", src: background5 },
    { alias: "generatedBackground1", src: generatedBackground1 },
    { alias: "player1", src: "/hero/hero_64.png" },
    { alias: "playerLeft", src: "/hero/hero_empty_left_64.png" },
    { alias: "playerTopLeft", src: "/hero/top2_left_64.png" },
    { alias: "playerRight", src: "/hero/hero_empty_right_64.png" },
    { alias: "playerTopRight", src: "/hero/top2_right_64.png" },
    { alias: "tree1", src: tree1 },
    { alias: "tree2", src: tree2 },
    { alias: "tree3", src: tree3 },
    { alias: "stone1", src: stone1 },
    { alias: "rabbitLeft", src: "/creatures/rabbit1_left_64.png" },
    { alias: "rabbitRight", src: "/creatures/rabbit1_right_64.png" },
    { alias: "wolfLeft", src: "/creatures/wolf1_left_64.png" },
    { alias: "wolfRight", src: "/creatures/wolf1_right_64.png" },
    { alias: "wood1", src: "/wood/wood1_64.png" },
    { alias: "stoneRes1", src: "/stone/stone_res1_64.png" },
    { alias: "toolAxe1", src: "/tools/axe1_64.png" },
    { alias: "toolPickaxe1", src: "/tools/pickaxe1_64.png" },
    { alias: "campFire1", src: campFire1 },
    { alias: "warehouse1", src: warehouse1 },
    { alias: "flag1", src: flag1 },
    { alias: "flag2", src: flag2 },
    { alias: "wagonWheel1", src: wagonWheel1 },
    { alias: "wagonBase1", src: wagonBase1 },
    { alias: "wagonBase2", src: wagonBase2 },
    { alias: "wagonEngine1", src: wagonEngine1 },
  ];

  static animationAssets = [
    { alias: "heroRight1", src: heroRight1 },
    { alias: "heroRight2", src: heroRight2 },
    { alias: "heroRight3", src: heroRight3 },
    { alias: "heroRight4", src: heroRight4 },
    { alias: "heroRight5", src: heroRight5 },
    { alias: "heroRight6", src: heroRight6 },
    { alias: "heroLeft1", src: heroLeft1 },
    { alias: "heroLeft2", src: heroLeft2 },
    { alias: "heroLeft3", src: heroLeft3 },
    { alias: "heroLeft4", src: heroLeft4 },
    { alias: "heroLeft5", src: heroLeft5 },
    { alias: "heroLeft6", src: heroLeft6 },
  ];

  static headAssets = [
    { alias: "unitHead1Left", src: unitHead1Left },
    { alias: "unitHead1Right", src: unitHead1Right },
  ];

  static hairAssets = [
    { alias: "unitHairClassicLeft", src: unitHairClassicLeft },
    { alias: "unitHairClassicRight", src: unitHairClassicRight },
  ];

  static topAssets = [
    { alias: "violetTopLeft", src: violetTopLeft },
    { alias: "violetTopRight", src: violetTopRight },
    { alias: "blackTopLeft", src: blackTopLeft },
    { alias: "blackTopRight", src: blackTopRight },
    { alias: "greenTopLeft", src: greenTopLeft },
    { alias: "greenTopRight", src: greenTopRight },
    { alias: "blueTopLeft", src: blueTopLeft },
    { alias: "blueTopRight", src: blueTopRight },
  ];

  public static async init() {
    await Assets.load(AssetsManager.assets);
    await Assets.load(AssetsManager.animationAssets);
    await Assets.load(AssetsManager.headAssets);
    await Assets.load(AssetsManager.hairAssets);
    await Assets.load(AssetsManager.topAssets);
  }

  public static getAnimatedSpriteHeroRight() {
    const images = [
      "heroRight1",
      "heroRight2",
      "heroRight3",
      "heroRight4",
      "heroRight5",
      "heroRight6",
    ];
    const textureArray = [];

    for (const image of images) {
      const texture = Texture.from(image);
      textureArray.push(texture);
    }

    const animation = new AnimatedSprite(textureArray);
    animation.anchor.set(0.5, 1);

    return animation;
  }

  public static getAnimatedSpriteHeroLeft() {
    const images = [
      "heroLeft1",
      "heroLeft2",
      "heroLeft3",
      "heroLeft4",
      "heroLeft5",
      "heroLeft6",
    ];
    const textureArray = [];

    for (const image of images) {
      const texture = Texture.from(image);
      textureArray.push(texture);
    }

    const animation = new AnimatedSprite(textureArray);
    animation.anchor.set(0.5, 1);

    return animation;
  }

  public static getRandomSpriteForBackground() {
    const sprite1 = Sprite.from("background1");
    const sprite2 = Sprite.from("background2");
    const sprite3 = Sprite.from("background3");
    const sprite4 = Sprite.from("background4");
    const sprite5 = Sprite.from("background5");

    const random = getRandomInRange(1, 100);
    if (random <= 55) {
      return sprite1;
    }
    if (random <= 93) {
      return sprite2;
    }
    if (random <= 96) {
      return sprite5;
    }
    if (random <= 98) {
      return sprite3;
    }
    return sprite4;
  }

  public static generateSceneBackground({
    width,
    height,
  }: {
    width: number;
    height: number;
  }) {
    const gridX = Math.ceil(width / 64);
    const gridY = Math.floor(height / 64);

    const bg: Sprite[] = [];

    for (let i = 0; i < gridX; i++) {
      for (let j = 0; j < gridY; j++) {
        const background = AssetsManager.getRandomSpriteForBackground();

        background.x = i * 64;
        background.y = j * 64;

        bg.push(background);
      }
    }

    return bg;
  }

  public static getGeneratedBackground() {
    return new TilingSprite({
      texture: Texture.from("generatedBackground1"),
    });
  }
}
