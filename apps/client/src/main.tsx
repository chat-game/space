import React from "react";
import ReactDOM from "react-dom/client";
import { Interface } from "./components/interface";
import { Sound } from "./components/sound.tsx";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
  <React.StrictMode>
    <Sound />
    <Interface />
  </React.StrictMode>,
);
