// ui/render.js
import {
    getActiveProject,
    getVisibleTasksForActiveProject,
    getTaskCountsByProject,
    getActiveTaskWithProject,
} from "../selectors.js";

function el(tag, { className, text, attrs } = {}) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text != null) node.textContent = text;
    if (attrs) for (const [k, v] of Object.entries(attrs)) node.setAttribute(k, v);
    return node;
}

export function renderSidebar(state) {
    const list = document.querySelector("#project-list");
    list.innerHTML = "";

    const summaries = getTaskCountsByProject(state);
    const activeId = state.ui.activeProjectId;

    for (const p of summaries) {
        const li = el("li", { className: "list__item" + (p.projectId === activeId ? " active" : "") });

        const btn = el("button", {
            className: "btn btn--link",
            text: `${p.name} (${p.remaining})`,
            attrs: { "data-project-id": p.projectId, type: "button" },
        });

        // Prevent deleting inbox in UI by not rendering delete button for it
        li.appendChild(btn);

        if (p.projectId !== "inbox") {
            const del = el("button", {
                className: "btn btn--danger",
                text: "Delete",
                attrs: { "data-delete-project-id": p.projectId, type: "button" },
            });
            li.appendChild(del);
        }

        list.appendChild(li);
    }
}

export function renderMain(state) {
    const activeTitle = document.querySelector("#active-project-title");
    const project = getActiveProject(state);
    activeTitle.textContent = project?.name ?? "Unknown";

    // Sync control UI values from state
    document.querySelector("#filter-select").value = state.ui.filter;
    document.querySelector("#search-input").value = state.ui.searchQuery;
    document.querySelector("#hide-completed-toggle").checked = state.settings.hideCompleted;
    document.querySelector("#sort-select").value = state.settings.defaultSort;

    const list = document.querySelector("#task-list");
    list.innerHTML = "";

    const tasks = getVisibleTasksForActiveProject(state);

    for (const t of tasks) {
        // base classes: list item + active selection
        let className = "list__item" + (t.id === state.ui.activeTaskId ? " active" : "");

        // NEW: completed styling hook (CSS uses .is-completed)
        if (t.completed) className += " is-completed";

        const li = el("li", { className });

        const checkbox = el("input", {
            attrs: { type: "checkbox", "data-toggle-task-id": t.id },
        });
        checkbox.checked = Boolean(t.completed);

        const titleBtn = el("button", {
            className: "btn btn--link",
            text: t.title,
            attrs: { type: "button", "data-task-id": t.id },
        });

        const meta = el("div", { className: "small", text: metaText(t) });

        const del = el("button", {
            className: "btn btn--danger",
            text: "Delete",
            attrs: { type: "button", "data-delete-task-id": t.id },
        });

        const left = el("div");
        left.style.display = "grid";
        left.style.gap = "2px";
        left.appendChild(titleBtn);
        left.appendChild(meta);

        li.appendChild(checkbox);
        li.appendChild(left);
        li.appendChild(del);

        list.appendChild(li);
    }
}

function metaText(t) {
    const due = t.dueDate ? `Due: ${t.dueDate}` : "No due date";
    const pr = `P${t.priority ?? 2}`;
    return `${due} • ${pr}`;
}

export function renderDetails(state) {
    const root = document.querySelector("#details-content");
    root.innerHTML = "";

    const { task, project } = getActiveTaskWithProject(state);

    if (!task) {
        root.appendChild(el("div", { text: "Select a task to view/edit details." }));
        return;
    }

    root.appendChild(el("div", { className: "small", text: `Project: ${project?.name ?? "Unknown"}` }));

    const form = el("form", { attrs: { id: "details-form" } });
    form.dataset.taskId = task.id;

    form.appendChild(field("Title", "details-title", "text", task.title));
    form.appendChild(field("Notes", "details-notes", "text", task.notes ?? ""));
    form.appendChild(field("Due date", "details-dueDate", "date", task.dueDate ?? ""));
    form.appendChild(field("Priority (1–3)", "details-priority", "number", String(task.priority ?? 2), { min: "1", max: "3" }));

    const completedRow = el("label", { className: "control control--inline" });
    const completed = el("input", { attrs: { type: "checkbox", id: "details-completed" } });
    completed.checked = Boolean(task.completed);
    completedRow.appendChild(completed);
    completedRow.appendChild(el("span", { text: "Completed" }));
    form.appendChild(completedRow);

    const actions = el("div", { className: "details__actions" });

    const save = el("button", { text: "Save", attrs: { type: "submit" } });
    const del = el("button", { text: "Delete task", className: "btn btn--danger", attrs: { type: "button", "data-delete-task-id": task.id } });

    actions.appendChild(save);
    actions.appendChild(del);
    form.appendChild(actions);

    root.appendChild(form);
}

function field(labelText, id, type, value, extraAttrs = {}) {
    const wrap = el("div", { className: "details__row" });
    wrap.appendChild(el("label", { text: labelText, attrs: { for: id } }));

    const input = el("input", { attrs: { id, type, ...extraAttrs } });
    input.value = value ?? "";
    wrap.appendChild(input);

    return wrap;
}