import { useEffect } from "react";
import useWebSocket from "react-use-websocket";
import {
  type GameObject,
  type GameObjectPlayer,
  type GameObjectStone,
  type GameObjectTree,
  MessageController,
} from "../../../../packages/api-sdk/src";
import { usePlayersStore } from "../store/players";
import { useRabbitsStore } from "../store/rabbits";
import { useStonesStore } from "../store/stones.ts";
import { useTreesStore } from "../store/trees";
import { useWolfsStore } from "../store/wolfs";

export const WebSocketsLayer = () => {
  const updateTree = useTreesStore((state) => state.update);
  const updateStone = useStonesStore((state) => state.update);
  const updatePlayer = usePlayersStore((state) => state.update);
  const updateRabbit = useRabbitsStore((state) => state.update);
  const updateWolf = useWolfsStore((state) => state.update);

  const socketUrl = "ws://localhost:4002";

  const { lastMessage, readyState } = useWebSocket(socketUrl, {
    shouldReconnect: () => true,
  });

  useEffect(() => {
    if (lastMessage !== null && readyState !== 3) {
      const action = MessageController.parseMessage(
        lastMessage.data.toString(),
      );
      if (!action) {
        return;
      }

      if (action.object) {
        if (action.object.entity === "PLAYER") {
          updatePlayer(action.object as GameObjectPlayer);
          return;
        }
        if (action.object.entity === "TREE") {
          updateTree(action.object as GameObjectTree);
          return;
        }
        if (action.object.entity === "STONE") {
          updateStone(action.object as GameObjectStone);
          return;
        }
        if (action.object.entity === "RABBIT") {
          updateRabbit(action.object as GameObject);
          return;
        }
        if (action.object.entity === "WOLF") {
          updateWolf(action.object as GameObject);
          return;
        }
      }
    }
  }, [
    lastMessage,
    readyState,
    updateTree,
    updateStone,
    updatePlayer,
    updateRabbit,
    updateWolf,
  ]);

  return <></>;
};
