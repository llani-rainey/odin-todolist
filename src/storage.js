// storage.js
const STORAGE_KEY = "top_todo_state_v1";

export function saveState(state) {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
    } catch {
        // ignore quota/serialization errors in MVP
    }
}

export function loadState() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return null;

        const parsed = JSON.parse(raw);

        // Minimal sanity checks
        if (!parsed || typeof parsed !== "object") return null;
        if (!Array.isArray(parsed.projects)) return null;
        if (!parsed.tasksById || typeof parsed.tasksById !== "object") return null;
        if (!parsed.ui || typeof parsed.ui !== "object") return null;
        if (!parsed.settings || typeof parsed.settings !== "object") return null;

        return parsed;
    } catch {
        return null;
    }
}