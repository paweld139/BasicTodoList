import {
    faArrowAltCircleDown,
    faArrowAltCircleUp,
    faTrashAlt
} from "@fortawesome/free-solid-svg-icons";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    Button,
    Input,
    Table
} from "reactstrap";

import { TableColumn } from "../interfaces";

interface Props {
    columns: TableColumn[];
    sort: (key: string) => void;
    getPostfix: (key: string) => string;
}

const AppTable = ({
    columns,
    sort,
    getPostfix
}: Props) => {
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
                    {columns.map(column =>
                        <th
                            key={column.key}
                            onClick={() => sort(column.key)}
                            className={column.centered ? 'text-center' : ''}
                        >
                            {column.label} {getPostfix(column.key)}
                        </th>
                    )}
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
        </Table>
    );
}

export default AppTable;

