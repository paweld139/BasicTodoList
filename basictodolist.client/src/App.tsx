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
    FormGroup,
    Button
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

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    faTrashAlt,
    faArrowAltCircleUp,
    faArrowAltCircleDown,
    faChevronUp,
    faChevronDown
} from '@fortawesome/free-solid-svg-icons';

function App() {
    const [tasks, setTasks] = useState<Task[]>([]);

    const [titleSearch, setTitleSearch] = useState('');

    const [dueDateFrom, setDueDateFrom] = useState<string>();

    const [dueDateTo, setDueDateTo] = useState<string>();

    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    const [sortField, setSortField] = useState<keyof Task | null>(null);

    const sortTasks = useCallback((field: keyof Task) => {
        const sortOrderToSet = sortOrder === null || field !== sortField ? 'asc' : sortOrder === 'asc' ? 'desc' : null;

        setSortOrder(sortOrderToSet);

        if (sortOrderToSet === null) {
            setTasks([...tasks].sort((a, b) => a.orderIndex - b.orderIndex));

            return;
        }
        else {
            setSortField(field);
        }

        setTasks([...tasks].sort((a, b) => {
            if (a[field] === b[field]) {
                return 0;
            }

            if (a[field] === null) {
                return 1;
            }

            if (b[field] === null) {
                return -1;
            }

            if (sortOrderToSet === 'asc') {
                return a[field]! > b[field]! ? 1 : -1;
            } else {
                return a[field]! < b[field]! ? 1 : -1;
            }
        }));
    }, [sortField, sortOrder, tasks]);

    const getPostfix = useCallback((field: string) => field === sortField ? sortOrder === 'asc' ? <FontAwesomeIcon icon={faChevronUp} /> : sortOrder === 'desc' ? <FontAwesomeIcon icon={faChevronDown} /> : null : null, [sortField, sortOrder]);

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
                        <th onClick={() => sortTasks('title')}>Title {getPostfix('title')}</th>
                        <th onClick={() => sortTasks('dueDate')}>Due date {getPostfix('dueDate')}</th>
                        <th onClick={() => sortTasks('isCompleted')} className="text-center">Completed {getPostfix('isCompleted')}</th>
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
                            <td style={{ width: '5rem' }}>
                                <div className="d-flex gap-2">
                                    <Button
                                        color="link"
                                        title="Delete task"
                                        className="p-0"
                                    >
                                        <FontAwesomeIcon
                                            icon={faTrashAlt}
                                            onClick={async () => {
                                                await deleteTask(task);

                                                populateTaskData();
                                            }}
                                            className="text-danger"
                                        />
                                    </Button>

                                    <Button
                                        color="link"
                                        title="Move task up"
                                        className="p-0"
                                        disabled={task.orderIndex === 0}
                                    >
                                        <FontAwesomeIcon
                                            icon={faArrowAltCircleUp}
                                            onClick={async () => {

                                                await moveTaskUp(task);

                                                populateTaskData();
                                            }}
                                            className="text-primary"
                                        />
                                    </Button>

                                    <Button
                                        color="link"
                                        title="Move task down"
                                        className="p-0"
                                        disabled={task.orderIndex === tasks.length - 1}
                                    >
                                        <FontAwesomeIcon
                                            icon={faArrowAltCircleDown}
                                            onClick={async () => {
                                                await moveTaskDown(task);

                                                populateTaskData();
                                            }}
                                            className="text-primary"
                                        />
                                    </Button>
                                </div>
                            </td>
                        </tr>
                    )}
                </tbody>
            </Table>);
    }, [filteredTasks, populateTaskData, sortTasks, tasks]);

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
                        </AccordionBody>
                    </AccordionItem>
                </Accordion>
            </Row>

            {contents}
        </Container>
    );
}

export default App;