import { Task } from "./interfaces";

const updateTask = (task: Task) =>
    fetch('/api/task', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(task)
    });

export const toggleTaskIsCompleted = (task: Task) =>
    updateTask({
        ...task,
        isCompleted: !task.isCompleted
    });

export const updateTaskTitle = (task: Task) =>
    updateTask({
        ...task,
        title: task.title
    });

export const updateTaskDueDate = (task: Task) =>
    updateTask({
        ...task,
        dueDate: task.dueDate ? task.dueDate : null
    });

export const deleteTask = (task: Task) =>
    fetch(`/api/task/${task.id}`, {
        method: 'DELETE'
    });

export const addTask = (title: string) =>
    fetch('/api/task', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            title
        })
    });

export const getTasks = async () => {
    const response = await fetch('/api/task');

    const status = response.status;

    if (status === 401) {
        window.location.href = "/Identity/Account/Login";

        return;
    }
    else if (status === 403) {
        window.location.href = "/Identity/Account/AccessDenied";

        return;
    }

    return await response.json();
}