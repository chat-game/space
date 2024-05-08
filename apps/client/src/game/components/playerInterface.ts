import { Graphics, Text } from "pixi.js";
import type { IGameObjectPlayer } from "../../../../../packages/api-sdk/src";
import { GraphicsContainer } from "./graphicsContainer";
import { UnitInterface } from "./unitInterface";

export class PlayerInterface extends UnitInterface {
  public userName: string;

  constructor(player: IGameObjectPlayer) {
    super(player);

    this.userName = player.userName;

    this.init();
  }

  init() {
    super.init();

    this.drawUserName(this.userName);
  }

  rebuild() {
    super.rebuild();

    this.drawUserName(this.userName);
  }

  drawUserName(userName: string) {
    const container = new GraphicsContainer({ type: "INTERFACE" });

    const basicText = new Text({
      text: userName,
      style: {
        fontFamily: "Noto Serif",
        fontSize: 14,
        fontWeight: "500",
        fill: 0x2e222f,
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
}
