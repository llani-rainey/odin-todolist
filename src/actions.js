const createId = (prefix) => `${prefix}_${crypto.randomUUID()}`; // unique id for each task or project prefixed with p or t, private function since we aren't exporting it 

export function addProject(state, name) {
    const trimmed = (name ?? "").toString().trim();
    if (!trimmed) return null; 

    const exists = state.projects.some(
        (p) => p.name.toLowerCase() === trimmed.toLowerCase()
    );

    if (exists) return null;

    const id = createId("p");
    state.projects.push({ id, name: trimmed, taskIds: []});

    return id;
}

export function addTask( 
    state,
    title,
    { // expects the 3rd arguement to be an object, and we destructure it but with default values with =, so if caller omits a field we still get a sensible value
        notes = "",
        dueDate = null,
        priority = 2,
        projectId = state.ui.activeProjectId
    } = {} // default value for the whole 3rd argument to prevent crashes / trying to destructure undefined, i.e if you dont pass in a 3rd arugment, pretend you pass in an empty {}, then defaults kick in
) {

    const trimmedTitle = (title ?? "").toString().trim();
    if (!trimmedTitle) return null; // task must have a non empty title i.e this fails to create a task


    const pid = (projectId ?? "").toString();
    const project = state.projects.find((p) => p.id === pid) 
    if (!project) return null; 

    const id = createId("t");

    state.tasksById[id] = {
        id,
        projectId: pid,
        title: trimmedTitle,
        notes: (notes ?? "").toString().trim(), // safeguard it by converting to string and giving and defaulting to ""
        dueDate,
        priority,
        completed: false,
        createdAt: Date.now(),
    };

    project.taskIds.push(id);

    return id;
}

export function removeProject(state, projectId) {
    const pid = (projectId ?? "").toString();
    if (pid === "inbox") return false;

    const index = state.projects.findIndex((p) => p.id === pid);
    if (index === -1) return false; // findIndex returns -1 if it doesnt exist, we need the index value because we will later splice it and we need index position

    const project = state.projects[index]; // gives the actual project object so we read its taskIds to delete tasks from state.tasksById, and update UI safely(e.g.if you deleted the active project)

    for (const taskId of project.taskIds) { // taskId is a string ID stored on the project; use it to delete the matching task record from the central tasksById lookup
        delete state.tasksById[taskId]; 
    }

    state.projects.splice(index, 1); // removes the project object from the state.projects array:

    //Fix UI pointers so we don't point at deleted stuff:
    if (state.ui.activeProjectId === pid) { 
        state.ui.activeProjectId = "inbox"; 
    }

//left side is pointer, right side use the pointer as the [property] and see if exists still, if undefined (because !undefined means true), change to null, notice the right side in [] is the left side, so we are checkign existience in the main warehouse in right side, !undefined  returns true so would then update to null when it is run (both are truthy)


    if (state.ui.activeTaskId && !state.tasksById[state.ui.activeTaskId])  {  
        state.ui.activeTaskId = null; //clear selection if the active task was just deleted. 
    }
    return true;
}

export function removeTask(state, taskId){
    const tid = (taskId ?? "").toString();
    const task = state.tasksById[tid]; // set taskId to 'task' for ease
    if (!task) return false; // guard that taskId actually exists

    delete state.tasksById[tid]; //NB: cant just write delete task, because task is just a local variable holdign a reference to the value, it isnt the entry in the tasksById object
    
    const project = state.projects.find((p) => p.id === task.projectId);
    if (project) {
        const idx = project.taskIds.indexOf(tid);
        if (idx !== -1) project.taskIds.splice(idx, 1);
    }

    if (state.ui.activeTaskId === tid) state.ui.activeTaskId = null;

    return true;
}

// UI helpers
const isNonEmptyString = (v) => typeof v === "string" && v.trim().length > 0;
const normalise = (s) => s.trim().toLowerCase();


// UI
// 1) Active project (also clears active task, because task selection is tied to the list view)
export function setActiveProjectId(state, projectId) {
    const pid = (projectId ?? "").toString();
    if (!pid) return false;

    const exists = state.projects.some((p) => p.id === pid);
    if (!exists) return false;

    state.ui.activeProjectId = pid;
    state.ui.activeTaskId = null;
    return true;
}

// 2) Active task (allow null to clear; otherwise require it exists) - null is the explict "nothing is selected" value, activeTaskId is a selection pointer
export function setActiveTaskId(state, taskId) {

    if (taskId == null) {
        state.ui.activeTaskId = null;
        return true;
    }

    const tid = (taskId ?? "").toString();
    if (!state.tasksById[tid]) return false;

    state.ui.activeTaskId = tid;
    return true;
}
// 3) Filter
const ALLOWED_FILTERS = new Set(["all", "today", "week", "overdue"]);

export function setFilter(state, filter) {
    if (!isNonEmptyString(filter)) return false;

    const normalised = normalise(filter);
    if (!ALLOWED_FILTERS.has(normalised)) return false;

    state.ui.filter = normalised;
    state.ui.activeTaskId = null; // optional: clear selection when list changes
    return true;
}

// 4) Search query
export function setSearchQuery(state, query) {
    const q = (query ?? "").toString();
    state.ui.searchQuery = q;
    state.ui.activeTaskId = null; // optional, reason: changing the search results can make the previously selected task disappear from the visible list, so clearing avoids “details panel shows a task you can’t currently see

    return true;
}

//settings

const ALLOWED_THEMES = new Set(["dark", "light"]);
const ALLOWED_SORTS = new Set(["dueDate", "priority", "createdAt", "title"]);

export function setTheme(state, theme) {
    const t = (theme ?? "").toString().trim().toLowerCase();
    if (!ALLOWED_THEMES.has(t)) return false;
    state.settings.theme = t;
    return true;
}

export function setHideCompleted(state, value) {
    state.settings.hideCompleted = Boolean(value);
    return true;
}

export function setDefaultSort(state, sortKey) {
    const k = (sortKey ?? "").toString().trim();
    if (!ALLOWED_SORTS.has(k)) return false;
    state.settings.defaultSort = k;
    return true;
}