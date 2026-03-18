// index.js
import "./styles.css";
import { createState } from "./state.js";
import { loadState, saveState } from "./storage.js";
import { initApp } from "./ui/app.js";

const state = loadState() ?? createState();

// Save once on unload (optional)
window.addEventListener("beforeunload", () => saveState(state));

initApp(state, {
    onCommit() {
        saveState(state);
    },
});