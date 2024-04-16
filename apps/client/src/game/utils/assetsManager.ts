import { AnimatedSprite, Assets, Texture } from "pixi.js";
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

export abstract class AssetsManager {
  static assets = [
    { alias: "background", src: "/Grass_Sample.png" },
    { alias: "player1", src: "/hero/hero_64.png" },
    { alias: "playerLeft", src: "/hero/hero_empty_left_64.png" },
    { alias: "playerTopLeft", src: "/hero/top2_left_64.png" },
    { alias: "playerRight", src: "/hero/hero_empty_right_64.png" },
    { alias: "playerTopRight", src: "/hero/top2_right_64.png" },
    { alias: "tree1", src: "/tree/tree1_128.png" },
    { alias: "tree2", src: "/tree/tree2_128.png" },
    { alias: "tree3", src: "/tree/tree3_128.png" },
    { alias: "stone1", src: "/stone/stone1_128.png" },
    { alias: "rabbitLeft", src: "/creatures/rabbit1_left_64.png" },
    { alias: "rabbitRight", src: "/creatures/rabbit1_right_64.png" },
    { alias: "wolfLeft", src: "/creatures/wolf1_left_64.png" },
    { alias: "wolfRight", src: "/creatures/wolf1_right_64.png" },
    { alias: "wood1", src: "/wood/wood1_64.png" },
    { alias: "stoneRes1", src: "/stone/stone_res1_64.png" },
    { alias: "toolAxe1", src: "/tools/axe1_64.png" },
    { alias: "toolPickaxe1", src: "/tools/pickaxe1_64.png" },
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

  public static async init() {
    await Assets.load(AssetsManager.assets);
    await Assets.load(AssetsManager.animationAssets);
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
}
