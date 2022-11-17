/* @refresh reload */
import "./index.css";
import { Router } from "@solidjs/router";
import { render } from "solid-js/web";
import BaseProvider from "./context";
import env from "config";

import App from "./App";

const root = document.getElementById("root");
if (!root) throw new Error("No root element found");

render(
  () => (
    <Router base={env.BASE_PATH}>
      <BaseProvider>
        <App />
      </BaseProvider>
    </Router>
  ),
  root
);
