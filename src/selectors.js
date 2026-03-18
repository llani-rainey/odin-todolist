//selectors.js
import { parseISO } from "date-fns";
import { isOverdue, isDueToday, isDueThisWeek } from "./date.js";

//1) Pointers
export function getProjects(state) { // Simple selector wrapper: keeps UI reading state through selectors (easy to refactor state shape later; one place to add sorting/derived fields)
    return state.projects;
}

export function getActiveProjectId(state) { 
    return state.ui.activeProjectId; // "inbox" or "p_1" etc (the pointer), a value that points to the real thing but isnt the thing itself. UI state stores "what the user is looking at right now" as IDs. Then when we need details, we "follow the pointer" i.e take the id -> find the matching object -> use it.
}

export function getActiveProject(state) {
    return state.projects.find(p => p.id === state.ui.activeProjectId) ?? null; // the actual project object {id, name, taskIds}
}

export function getActiveTask(state) {
    const id = state.ui.activeTaskId;
    return id ? state.tasksById[id] ?? null : null;
}

//2) Base List: tasks for a project (by ids -> objects).  given a project ID, what are the tasks in that project? [must return actual task objects]

export function getTasksForProject(state, projectId) { // should return a list of tasks
    const pid = (projectId ?? "").toString();
    const project = state.projects.find(p => p.id === pid);

    if (!project) return []; //not null or false, because the "type" of this selector's answer is: array of tasks, if the project isn't found, there are zero tasks, so the correct answer is an empty array, this matters because UI code expects it can do list things (i.e 
    // const tasks = getTasksForProject(state, someId);
    //tasks.forEach(renderTask); 
    // if we returned null, then tasks.forEach(...) would crash. If a function conceptually returns a list, return [] when there are none, if it returns a single thing, return null when it isnt there.

    return project.taskIds.map((id) => state.tasksById[id]).filter(Boolean); //map turns the array of taskIds (inside project.taskIds) into look ups for the actual tasks from the tasksById warehouse, return array will be same length
    //.filter(Boolean) defensively removes falsy values (we are mainly interested in anything undefined), alternatively we could have done .filter((t) => t != null); Boolean is being passed as a callback function / function reference which will then do Boolean(element) on each element when called for each iteration
}

export function getActiveProjectTasks(state) { // what are the tasks that belong to the currently selected / active project
    return getTasksForProject(state, state.ui.activeProjectId);
}

//3 Derived list: the final list to render

// 3a) Filter helper: given array of tasks + current filter, return subset (array of tasks)
 function applyFilter(tasks, filter) { // helper so not exported 
    switch (filter) {
        case "today":
            return tasks.filter((t) => isDueToday(t.dueDate));
        case "week":
            return tasks.filter((t) => isDueThisWeek(t.dueDate));
        case "overdue":
            return tasks.filter((t) => isOverdue(t.dueDate) && !t.completed);
        case "all":
        default:
            return tasks;
    }
}
//3b Search helper
 function matchesSearch(task, query) { // Does this one task match the current search text?”
    const q = (query ?? "").toString().trim().toLowerCase(); // If query is null or undefined, use "" instead. Prevents crashes.standardise/normalise it too
    if (!q) return true; //if the search query is empty eg "" then every task "matches" the search

    const hay = `${(task.title ?? "").toString()} ${(task.notes ?? "").toString()}`.toLowerCase(); // combines the title and notes strings using safety
    return hay.includes(q);
}

//3c sort helper
function compareTasks(a, b, sortKey) { //a and b are two task objects being compared, sort keys are: "dueDate" | "priority" | "createdAt" | "title"
    switch (sortKey) { 
        case "dueDate": {
            const aDue = a.dueDate ? parseISO(a.dueDate).getTime() : Infinity;
            const bDue = b.dueDate ? parseISO(b.dueDate).getTime() : Infinity;
            return aDue - bDue; // a comparator must return a number. negative means a comes before b, positive b comes before a, 0 no prefence , this is to later help .sort() which will use this. if one task has no due date, we set it to infinity so it gets pushed to end
        }
        case "priority":
            return (a.priority ?? 0) - (b.priority ?? 0);
        case "createdAt":
            return (a.createdAt ?? 0) - (b.createdAt ?? 0);
        case "title":
        default:
            return (a.title ?? "").toLowerCase().localeCompare((b.title ?? "").toLowerCase()); // .localCompare is built in function, comapres two strings, returns negative if left string should come before right string, (like above)
    }
} 

// 3d) Final selector: the task list UI should call THIS
export function getVisibleTasksForActiveProject(state) { // final list the UI should display for the active project after applying: 1) hideCompleted toggle, 2) filter 3) search query 4) sort mode, starting from the base list and building it from there

    let tasks = getActiveProjectTasks(state); // base list

    if (state.settings.hideCompleted) { // 1 - hide completed toggle
        tasks = tasks.filter((t) => t.completed === false); // reassign the variable tasks to this new array, uses the old tasks variable as the basis (i.e tasks is now a subset of the old array tasks)
    }

    tasks = applyFilter(tasks, state.ui.filter); // 2 - filter (all / today / week / overdue)
    tasks = tasks.filter((t) => matchesSearch(t, state.ui.searchQuery)); // 3 - search query (matches string)

    return [...tasks].sort((a, b) => compareTasks(a, b, state.settings.defaultSort)); // 4 - Sort mode - apply the sort mode using compareTasks helper. .sort() mutates the array it sorts but we want no side effects / read only so we do a shallow copy of tasks using [...tasks]
}

//4 summary selector: counts for sidebar badges
export function getTaskCountsByProject(state) { // summary counts for every project (for sidebar badges).  “For each project, how many tasks does it have, and how many are still incomplete?”
    return state.projects.map((p) => { // returns an array of objects shaped per below, must expliclty return as we are doign a block of code
        const tasks = p.taskIds.map((id) => state.tasksById[id]).filter((t) => t != null);

        const total = tasks.length;
        const remaining = tasks.filter((t) => !t.completed).length;

        return { projectId: p.id, name: p.name, total, remaining }; // returns one summary object per project for the outside array where each object is 1 element in the array
    });
}

//5 optional "join" selector for details UI
export function getActiveTaskWithProject(state) { // “What task is currently selected, and which project does it belong to?”
    const task = getActiveTask(state);
    if (!task) return { task: null, project: null }; // consistent shape with below, This prevents UI from crashing and makes rendering easy, if task is null, show “no task selected”.

    const project = state.projects.find((p) => p.id === task.projectId) ?? null; // so project is either a project object or null
    return { task, project };
}


