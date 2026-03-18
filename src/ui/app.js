// ui/app.js
import { renderSidebar, renderMain, renderDetails } from "./render.js";
import { wireEvents } from "./events.js";

export function renderApp(state) {
    renderSidebar(state);
    renderMain(state);
    renderDetails(state);
}

export function initApp(state, { onCommit } = {}) {
    const commit = () => {
        if (typeof onCommit === "function") onCommit();
        renderApp(state);
    };

    wireEvents(state, commit);
    renderApp(state);
}