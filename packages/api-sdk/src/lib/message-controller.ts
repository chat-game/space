import type {WebSocketMessage} from "./types";

export class MessageController {
    private readonly message: string;

    constructor(message: string) {
        this.message = message;
    }

    public static parseMessage(message: string): WebSocketMessage | undefined {
       const parsed = JSON.parse(message);
       if (parsed) {
           return parsed as WebSocketMessage;
       }

       return undefined;
    }
}