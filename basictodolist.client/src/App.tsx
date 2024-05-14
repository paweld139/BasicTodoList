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
    Col
} from 'reactstrap';

import { Task } from './interfaces';

import {
    addTask,
    deleteTask,
    getTasks,
    toggleTaskIsCompleted,
    updateTaskTitle
} from './requests';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

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
                        <th className="text-center">Completed</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {tasks?.map(task =>
                        <tr
                            key={task.id}
                            onClick={() => {
                                task.isEditing = true;

                                setTasks([...tasks]);
                            }}
                        >
                            <td>
                                {!task.isEditing ? task.title : (
                                    <Input
                                        type="text"
                                        onChange={(event) => {
                                            task.title = event.target.value;

                                            setTasks([...tasks]);
                                        }}
                                        value={task.title}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                (event.target as HTMLInputElement).blur()
                                            }
                                        }}
                                        onBlur={async () => {
                                            await updateTaskTitle(task);

                                            populateTaskData();
                                        }}
                                        autoFocus
                                    />
                                )}
                            </td>
                            <td
                                style={{ width: '8rem' }}
                                className="text-center"
                            >
                                <Input
                                    type="checkbox"
                                    checked={task.isCompleted}
                                    onChange={async () => {
                                        await toggleTaskIsCompleted(task);

                                        populateTaskData();
                                    }}
                                />
                            </td>
                            <td
                                style={{ width: '5rem' }}
                                className="text-center"
                            >
                                <FontAwesomeIcon
                                    icon={faTrashAlt}
                                    onClick={async () => {
                                        await deleteTask(task);

                                        populateTaskData();
                                    }}
                                    className="text-danger"
                                    role="button"
                                    title="Delete task"
                                />
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
            <h1>Tasks</h1>

            <Row
                className="mb-2"
                xs="auto"
            >
                <span>Total tasks: {tasks?.length}</span>

                <span>Completed tasks: {tasks?.filter(task => task.isCompleted).length}</span>

                <span>Pending tasks: {tasks?.filter(task => !task.isCompleted).length}</span>
            </Row>

            <Row className="mb-2">
                <Col md="6">
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

            {contents}
        </Container>
    );
}

export default App;