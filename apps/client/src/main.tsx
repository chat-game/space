import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import { InterfaceLayer } from "./layers/interface";
import { PlayersLayer } from "./layers/players";
import { RabbitsLayer } from "./layers/rabbits";
import { SoundLayer } from "./layers/sound";
import { StonesLayer } from "./layers/stones";
import { TreesLayer } from "./layers/trees";
import { WebSocketsLayer } from "./layers/websocket";
import { WolfsLayer } from "./layers/wolfs";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <SoundLayer />
    <TreesLayer />
    <StonesLayer />
    <RabbitsLayer />
    <WolfsLayer />
    <PlayersLayer />
    <InterfaceLayer />
    <WebSocketsLayer />
  </React.StrictMode>,
);
