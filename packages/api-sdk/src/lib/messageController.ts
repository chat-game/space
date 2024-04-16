import type {WebSocketMessage} from "./types";

export class MessageController {
    public static parse(message: string): WebSocketMessage | undefined {
       const parsed = JSON.parse(message);
       if (parsed) {
           return parsed as WebSocketMessage;
       }

       return undefined;
    }
}