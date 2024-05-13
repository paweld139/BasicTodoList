import { useEffect, useState } from 'react';
import './App.css';

interface Task {
    id: number;
    title: string;
    isCompleted: boolean;
}

function App() {
    const [tasks, setTasks] = useState<Task[]>();

    useEffect(() => {
        populateTaskData();
    }, []);

    const contents = tasks === undefined
        ? <p><em>Loading...</em></p>
        : <table className="table table-striped" aria-labelledby="tableLabel">
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Is completed</th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task =>
                    <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>{task.isCompleted ? 'Yes' : 'No'}</td>
                    </tr>
                )}
            </tbody>
        </table>;

    return (
        <div>
            <h1 id="tableLabel">Tasks</h1>
            <p>This table shows the tasks.</p>
            {contents}
        </div>
    );

    async function populateTaskData() {
        const response = await fetch('/api/task');
        const data = await response.json();
        setTasks(data);
    }
}

export default App;