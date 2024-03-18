import React from "react";
import ReactDOM from "react-dom/client";
import { Interface } from "./components/interface.js";
import "./index.css";

ReactDOM.createRoot(document.getElementById("root") as HTMLElement).render(
	<React.StrictMode>
		<Interface />
	</React.StrictMode>,
);
