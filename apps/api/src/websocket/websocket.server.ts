import { createId } from "@paralleldrive/cuid2"
import type { WebSocketMessage } from "../../../../packages/api-sdk/src"

export const server = Bun.serve({
  port: 4002,
  fetch(req, server) {
    // const cookies = req.headers.get("cookie");
    // const username = getUsernameFromCookies(cookies);
    //const success = server.upgrade(req, { data: { username: '123' } });
    if (server.upgrade(req)) return undefined

    return new Response("Hello world")
  },
  websocket: {
    open(ws) {
      ws.subscribe("game")
      console.log("smb connected")
    },
    message() {
      //const action = MessageController.parseMessage(message.toString());
      //if (!action) {
      //  return;
      //}
      //new ActionService(action);
      // server.publish("game", `${message}`);
    },
    close(ws) {
      ws.unsubscribe("game")
    },
  },
})

export function sendMessage(
  event: WebSocketMessage["event"],
  object?: WebSocketMessage["object"],
) {
  server.publish("game", JSON.stringify({ id: createId(), event, object }))
}

console.log(`WebSocket server: listening on ${server.hostname}:${server.port}`)
