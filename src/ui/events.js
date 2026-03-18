// ui/events.js
import {
    addProject,
    addTask,
    removeProject,
    removeTask,
    setActiveProjectId,
    setActiveTaskId,
    setFilter,
    setSearchQuery,
    setHideCompleted,
    setDefaultSort,
    toggleTaskCompleted,
    updateTask,
} from "../actions.js";

export function wireEvents(state, commit) {
    // Sidebar: project select + delete
    document.querySelector("#project-list").addEventListener("click", (e) => {
        const projectBtn = e.target.closest("button[data-project-id]");
        if (projectBtn) {
            setActiveProjectId(state, projectBtn.dataset.projectId);
            commit();
            return;
        }

        const delBtn = e.target.closest("button[data-delete-project-id]");
        if (delBtn) {
            removeProject(state, delBtn.dataset.deleteProjectId);
            commit();
        }
    });

    // Add project form
    document.querySelector("#add-project-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const input = document.querySelector("#project-name-input");
        const id = addProject(state, input.value);
        if (id) setActiveProjectId(state, id);
        input.value = "";
        commit();
    });

    // Task list: select task, toggle completed, delete
    document.querySelector("#task-list").addEventListener("click", (e) => {
        const taskBtn = e.target.closest("button[data-task-id]");
        if (taskBtn) {
            setActiveTaskId(state, taskBtn.dataset.taskId);
            commit();
            return;
        }

        const delBtn = e.target.closest("button[data-delete-task-id]");
        if (delBtn) {
            removeTask(state, delBtn.dataset.deleteTaskId);
            commit();
        }
    });

    document.querySelector("#task-list").addEventListener("change", (e) => {
        const toggle = e.target.closest("input[data-toggle-task-id]");
        if (!toggle) return;
        toggleTaskCompleted(state, toggle.dataset.toggleTaskId);
        commit();
    });

    // Add task form
    document.querySelector("#add-task-form").addEventListener("submit", (e) => {
        e.preventDefault();
        const title = document.querySelector("#task-title-input").value;
        const dueDateRaw = document.querySelector("#task-date-input").value; // "" or "YYYY-MM-DD"
        const priority = document.querySelector("#task-priority-input").value;

        const id = addTask(state, title, {
            dueDate: dueDateRaw || null,
            priority: Number(priority),
        });

        if (id) setActiveTaskId(state, id);

        document.querySelector("#task-title-input").value = "";
        document.querySelector("#task-date-input").value = "";
        document.querySelector("#task-priority-input").value = "2";

        commit();
    });

    // Controls
    document.querySelector("#filter-select").addEventListener("change", (e) => {
        setFilter(state, e.target.value);
        commit();
    });

    document.querySelector("#search-input").addEventListener("input", (e) => {
        setSearchQuery(state, e.target.value);
        commit();
    });

    document.querySelector("#hide-completed-toggle").addEventListener("change", (e) => {
        setHideCompleted(state, e.target.checked);
        commit();
    });

    document.querySelector("#sort-select").addEventListener("change", (e) => {
        setDefaultSort(state, e.target.value);
        commit();
    });

    // Details: save edits + delete
    document.querySelector("#details-content").addEventListener("submit", (e) => {
        const form = e.target.closest("form#details-form");
        if (!form) return;

        e.preventDefault();

        const tid = form.dataset.taskId;

        const title = document.querySelector("#details-title").value;
        const notes = document.querySelector("#details-notes").value;
        const dueDate = document.querySelector("#details-dueDate").value || null;
        const priority = document.querySelector("#details-priority").value;
        const completed = document.querySelector("#details-completed").checked;

        updateTask(state, tid, { title, notes, dueDate, priority, completed });
        commit();
    });

    document.querySelector("#details-content").addEventListener("click", (e) => {
        const delBtn = e.target.closest("button[data-delete-task-id]");
        if (!delBtn) return;

        removeTask(state, delBtn.dataset.deleteTaskId);
        commit();
    });
}