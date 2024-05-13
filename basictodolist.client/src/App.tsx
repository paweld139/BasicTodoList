import {
    useEffect,
    useState
} from 'react';

import {
    Table,
    Container,
    Row,
    Input,
    Col,
    Button
} from 'reactstrap';

interface Task {
    id: number;
    title: string;
    isCompleted: boolean;
}

function App() {
    const [tasks, setTasks] = useState<Task[]>();

    const [title, setTitle] = useState('');

    useEffect(() => {
        populateTaskData();
    }, []);

    const contents = tasks === undefined
        ? <p><em>Loading...</em></p>
        : <Table
            bordered
            dark
            hover
            responsive
            striped
        >
            <thead>
                <tr>
                    <th>Title</th>
                    <th>Is completed</th>
                    <th></th>
                </tr>
            </thead>
            <tbody>
                {tasks.map(task =>
                    <tr key={task.id}>
                        <td>{task.title}</td>
                        <td>
                            <Input
                                type="checkbox"
                                checked={task.isCompleted}
                                onChange={async () => {
                                    await fetch('/api/task', {
                                        method: 'PUT',
                                        headers: {
                                            'Content-Type': 'application/json'
                                        },
                                        body: JSON.stringify({
                                            ...task,
                                            isCompleted: !task.isCompleted
                                        })
                                    });

                                    populateTaskData();
                                }}
                            />
                        </td>
                        <td>
                            <Button
                                onClick={async () => {
                                    await fetch(`/api/task/${task.id}`, {
                                        method: 'DELETE'
                                    });

                                    populateTaskData();
                                }}
                                color="danger"
                                size="sm"
                            >
                                Delete
                            </Button>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>;

    return (
        <Container fluid>
            <Row>
                <Col>
                    <h1>Tasks</h1>
                </Col>
            </Row>

            <Row className="mb-2">
                <Col md="auto">
                    Total tasks: {tasks?.length}
                </Col>

                <Col md="auto">
                    Completed tasks: {tasks?.filter(task => task.isCompleted).length}
                </Col>

                <Col md="auto">
                    Pending tasks: {tasks?.filter(task => !task.isCompleted).length}
                </Col>
            </Row>

            <Row className="mb-2">
                <Col md="auto">
                    <Input
                        type="text"
                        placeholder="Enter a new task"
                        onChange={(event) => setTitle(event.target.value)}
                        value={title}
                        onKeyDown={async (event) => {
                            if (event.key === 'Enter') {
                                await fetch('/api/task', {
                                    method: 'POST',
                                    headers: {
                                        'Content-Type': 'application/json'
                                    },
                                    body: JSON.stringify({
                                        title: title
                                    })
                                });

                                setTitle('');

                                populateTaskData();
                            }
                        }}
                    />
                </Col>
            </Row>

            <Row>
                {contents}
            </Row>
        </Container>
    );

    async function populateTaskData() {
        const response = await fetch('/api/task');

        const data = await response.json();

        setTasks(data);
    }
}

export default App;