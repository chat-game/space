export const server = Bun.serve({
  port: 4002,
  fetch(req, server) {
    // const cookies = req.headers.get("cookie");
    // const username = getUsernameFromCookies(cookies);
    //const success = server.upgrade(req, { data: { username: '123' } });
    if (server.upgrade(req)) return undefined;

    return new Response("Hello world");
  },
  websocket: {
    open(ws) {
      ws.subscribe("game");
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
      ws.unsubscribe("game");
    },
  },
});

console.log(`WebSocket server: listening on ${server.hostname}:${server.port}`);
