import {
    useCallback,
    useEffect,
    useMemo,
    useState
} from 'react';

import {
    Container,
    Row,
    Input,
    Col,
    Label,
    FormGroup
} from 'reactstrap';

import { Task } from './interfaces';

import {
    addTask,
    deleteTask,
    getTasks,
    toggleTaskIsCompleted,
    updateTaskDueDate,
    updateTaskTitle,
    moveTaskUp,
    moveTaskDown
} from './requests';

import {
    faTrashAlt,
    faArrowAltCircleUp,
    faArrowAltCircleDown
} from '@fortawesome/free-solid-svg-icons';

import AppAccordion from './components/AppAccordion';

import AppTable from './components/AppTable';

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);

    const [titleSearch, setTitleSearch] = useState('');

    const [dueDateFrom, setDueDateFrom] = useState<string>();

    const [dueDateTo, setDueDateTo] = useState<string>();

    const filteredTasks = useMemo(() => {
        return tasks?.filter(task =>
            task.title.toLowerCase().includes(titleSearch.toLowerCase()) &&
            (!dueDateFrom || new Date(task.dueDate!) >= new Date(dueDateFrom)) &&
            (!dueDateTo || new Date(task.dueDate!) <= new Date(dueDateTo))
        );
    }, [dueDateFrom, dueDateTo, tasks, titleSearch]);

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
            <AppTable
                columns={[
                    {
                        label: 'Title',
                        key: 'title',
                        onClick: (data) => {
                            data.isEditingTitle = true;

                            setTasks([...tasks]);
                        },
                        type: 'text',
                        canEdit: t => t.isEditingTitle,
                        onChange: (event, data) => {
                            data.title = event.target.value;

                            setTasks([...tasks]);
                        },
                        onBlur: async (data) => {
                            await updateTaskTitle(data);

                            populateTaskData();
                        }
                    },
                    {
                        label: 'Due date',
                        key: 'dueDate',
                        onClick: (data) => {
                            data.isEditingDueDate = true;

                            setTasks([...tasks]);
                        },
                        type: 'datetime-local',
                        canEdit: t => t.isEditingDueDate,
                        onChange: (event, data) => {
                            data.dueDate = event.target.value;

                            setTasks([...tasks]);
                        },
                        onBlur: async (data) => {
                            await updateTaskDueDate(data);

                            populateTaskData();
                        },
                        width: '14rem'
                    },
                    {
                        label: 'Completed',
                        key: 'isCompleted',
                        centered: true,
                        type: 'checkbox',
                        canEdit: () => true,
                        onChange: async (_event, data) => {
                            await toggleTaskIsCompleted(data);

                            populateTaskData();
                        },
                        width: '8rem'
                    }
                ]}
                filteredData={filteredTasks}
                rowActions={[
                    {
                        title: 'Delete task',
                        onClick: async (data) => {
                            await deleteTask(data);

                            populateTaskData();
                        },
                        icon: faTrashAlt,
                        color: 'danger'
                    },
                    {
                        title: 'Move task up',
                        onClick: async (data) => {
                            await moveTaskUp(data);

                            populateTaskData();
                        },
                        icon: faArrowAltCircleUp,
                        color: 'primary',
                        disabled: (data) => data.orderIndex === 0
                    },
                    {
                        title: 'Move task down',
                        onClick: async (data) => {
                            await moveTaskDown(data);

                            populateTaskData();
                        },
                        icon: faArrowAltCircleDown,
                        color: 'primary',
                        disabled: (data) => data.orderIndex === tasks.length - 1
                    }
                ]}
                data={tasks}
                setData={setTasks}
                defaultSort={(a, b) => a.orderIndex - b.orderIndex}
                keyProp="orderIndex"
            />);
    }, [filteredTasks, populateTaskData, tasks]);

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

            <Row className="mb-2">
                <AppAccordion header="Filters">
                    <Container fluid>
                        <Row md="3" sm="2" xs="1">
                            <FormGroup>
                                <Label for="title">Title</Label>
                                <Input
                                    type="search"
                                    onChange={(event) => setTitleSearch(event.target.value)}
                                    value={titleSearch}
                                    id="title"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="dueDateFrom">Due date from</Label>
                                <Input
                                    type="datetime-local"
                                    onChange={(event) => setDueDateFrom(event.target.value)}
                                    value={dueDateFrom}
                                    id="dueDateFrom"
                                />
                            </FormGroup>

                            <FormGroup>
                                <Label for="dueDateTo">Due date to</Label>
                                <Input
                                    type="datetime-local"
                                    onChange={(event) => setDueDateTo(event.target.value)}
                                    value={dueDateTo}
                                    id="dueDateTo"
                                />
                            </FormGroup>
                        </Row>
                    </Container>
                </AppAccordion>
            </Row>

            {contents}
        </Container>
    );
}

export default App;