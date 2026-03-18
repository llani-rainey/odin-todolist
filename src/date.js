//date.js
import { parseISO, isBefore, startOfToday, isToday, isThisWeek } from "date-fns" // must import individual functions per documentation, named imports with curly braces

export function isOverdue(dueDateStr) {
    if (!dueDateStr) return false;
    return isBefore(parseISO(dueDateStr), startOfToday());
}

export function isDueToday(dueDateStr) {
    if (!dueDateStr) return false;
    return isToday(parseISO(dueDateStr));
}

export function isDueThisWeek(dueDateStr) {
    if (!dueDateStr) return false;
    return isThisWeek(parseISO(dueDateStr), { weekStartsOn: 1 });
}