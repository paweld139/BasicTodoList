import { Task } from "./interfaces";

export const toggleTaskIsCompleted = (task: Task) =>
    fetch('/api/task', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...task,
            isCompleted: !task.isCompleted
        })
    });

export const updateTaskTitle = (task: Task) =>
    fetch('/api/task', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            ...task,
            title: task.title
        })
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

    return await response.json();
}