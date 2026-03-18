//state.js
export function createState() {
    return {
        projects: [
            {
                id: "inbox", //   id: "p1", default to p1
                name: "Inbox", //   name: "Inbox",
                taskIds: [], //   taskIds: ["t1","t2"]   // reference tasks by id
            }
        ],

        tasksById: {
            // t1: { id:"t1", 
            // projectId:"p1", 
            // title:"...", 
            // notes:"...", 
            // dueDate:"2026-01-31", 
            // priority:2, 
            // completed:false, 
            // createdAt: 1730000000000 } //NB: 1 task to 1 project , 1 task can not be in multiple project (safer/easier)
        },

        // --- UI state (what the user is currently looking at) ---
        ui: {
            activeProjectId: "inbox", // which project is selected right now
            activeTaskId: null,       // which task is selected for details/editing
            filter: "all",            // options: "all" | "today" | "week" | "overdue"
            searchQuery: "",          // options: any string
        },

        // --- settings/preferences (persisted) ---
        settings: {
            theme: "dark",            // "dark" | "light"
            hideCompleted: false,     // true | false
            defaultSort: "dueDate",   // "dueDate" | "priority" | "createdAt" | "title"
        }
    };
}