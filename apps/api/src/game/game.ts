import type {
  ChatAction,
  GameSceneType,
} from "../../../../packages/api-sdk/src";
import { DBRepository } from "../db/db.repository";
import { sendMessage } from "../websocket/websocket.server";
import type { Group } from "./common";
import { DefenceScene, type GameScene, VillageScene } from "./scenes";

interface HandleChatCommandOptions {
  action: ChatAction;
  userId: string; // Twitch
  userName: string; // Twitch
  viewerCount?: number;
  params?: string[];
}

interface HandleChatCommandResponse {
  ok: boolean;
  message: string | null;
}

export class Game {
  public repository: DBRepository;
  public scene!: GameScene;

  constructor() {
    this.repository = new DBRepository();

    this.initScene("VILLAGE");
  }

  public async handleChatCommand({
    action,
    userId,
    userName,
    viewerCount,
    params,
  }: HandleChatCommandOptions): Promise<HandleChatCommandResponse> {
    const player = await this.repository.findOrCreatePlayer(userId, userName);

    if (action === "START_RAID") {
      // Raid must be in all rooms!
      return this.scene.startRaidAction(viewerCount);
    }

    return this.scene.handleAction(action, player.id, params);
  }

  public initScene(scene: GameSceneType) {
    const { group } = this.prepareSceneBeforeChange();

    if (scene === "VILLAGE") {
      this.scene = new VillageScene(this, group);
      return;
    }
    if (scene === "DEFENCE") {
      this.scene = new DefenceScene(this, group);
      return;
    }
  }

  public prepareSceneBeforeChange() {
    let group: Group | undefined;
    if (this.scene?.group) {
      group = this.scene.group;
    }
    if (this.scene) {
      this.scene.destroy();
    }
    sendMessage("SCENE_CHANGED");

    return {
      group,
    };
  }
}
