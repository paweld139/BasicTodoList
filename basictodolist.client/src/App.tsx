import {
    useCallback,
    useEffect,
    useMemo,
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

import { Task } from './interfaces';

import {
    addTask,
    deleteTask,
    getTasks,
    toggleTaskIsCompleted
} from './requests';

function App() {
    const [tasks, setTasks] = useState<Task[]>();

    const [title, setTitle] = useState('');

    const populateTaskData = useCallback(async () => {
        const tasks = await getTasks();

        setTasks(tasks);
    }, []);

    useEffect(() => {
        populateTaskData();
    }, [populateTaskData]);

    const getTable = useCallback(() => {
        return (
            <Table
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
                    {tasks?.map(task =>
                        <tr key={task.id}>
                            <td>{task.title}</td>
                            <td>
                                <Input
                                    type="checkbox"
                                    checked={task.isCompleted}
                                    onChange={async () => {
                                        await toggleTaskIsCompleted(task);

                                        populateTaskData();
                                    }}
                                />
                            </td>
                            <td>
                                <Button
                                    onClick={async () => {
                                        await deleteTask(task);

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
            </Table>);
    }, [populateTaskData, tasks]);

    const getLoading = useCallback(() => <p><em>Loading...</em></p>, []);

    const contents = useMemo(() => !tasks ? getLoading() : getTable(), [getLoading, getTable, tasks]);

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
                                await addTask(title);

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
}

export default App;