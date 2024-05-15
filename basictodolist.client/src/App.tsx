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
    Accordion,
    AccordionBody,
    AccordionHeader,
    AccordionItem,
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
    updateTaskTitle
} from './requests';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { faTrashAlt } from '@fortawesome/free-regular-svg-icons';

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

    const [open, setOpen] = useState('1');

    const toggle = (id: string) => {
        if (open === id) {
            setOpen('');
        } else {
            setOpen(id);
        }
    };

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
                        <th>Due date</th>
                        <th className="text-center">Completed</th>
                        <th className="text-center">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredTasks?.map(task =>
                        <tr
                            key={task.id}
                        >
                            <td
                                onClick={() => {
                                    task.isEditingTitle = true;

                                    setTasks([...tasks]);
                                }}
                            >
                                {!task.isEditingTitle ? task.title : (
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
                                onClick={() => {
                                    task.isEditingDueDate = true;

                                    setTasks([...tasks]);
                                }}
                                style={{ width: '14rem' }}
                            >
                                {!task.isEditingDueDate ? task.dueDate ? new Date(task.dueDate).toLocaleString() : null : (
                                    <Input
                                        type="datetime-local"
                                        onChange={(event) => {
                                            task.dueDate = event.target.value;

                                            setTasks([...tasks]);
                                        }}
                                        value={task.dueDate ?? ''}
                                        onKeyDown={(event) => {
                                            if (event.key === 'Enter') {
                                                (event.target as HTMLInputElement).blur()
                                            }
                                        }}
                                        onBlur={async () => {
                                            await updateTaskDueDate(task);

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
                <Accordion
                    open={open}
                    toggle={toggle}
                >
                    <AccordionItem>
                        <AccordionHeader targetId="1">Filters</AccordionHeader>

                        <AccordionBody accordionId="1">
                            <Container fluid>
                                <Row md="3" sm="2" xs="1">
                                    <Col>
                                        <FormGroup>
                                            <Label for="title">Title</Label>
                                            <Input
                                                type="search"
                                                onChange={(event) => setTitleSearch(event.target.value)}
                                                value={titleSearch}
                                                id="title"
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col>
                                        <FormGroup>
                                            <Label for="dueDateFrom">Due date from</Label>
                                            <Input
                                                type="datetime-local"
                                                onChange={(event) => setDueDateFrom(event.target.value)}
                                                value={dueDateFrom}
                                                id="dueDateFrom"
                                            />
                                        </FormGroup>
                                    </Col>

                                    <Col>
                                        <FormGroup>
                                            <Label for="dueDateTo">Due date to</Label>
                                            <Input
                                                type="datetime-local"
                                                onChange={(event) => setDueDateTo(event.target.value)}
                                                value={dueDateTo}
                                                id="dueDateTo"
                                            />
                                        </FormGroup>
                                    </Col>
                                </Row>
                            </Container>
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </Row>

            {contents}
        </Container>
    );
}

export default App;