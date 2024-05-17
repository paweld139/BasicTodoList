import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

import {
    Button,
    Input,
    Table
} from "reactstrap";

import {
    Entity,
    TableColumn,
    TableRowAction
} from "../interfaces";

import {
    faChevronDown,
    faChevronUp
} from "@fortawesome/free-solid-svg-icons";

import {
    useCallback,
    useState
} from "react";

interface Props<T extends Entity> {
    columns: TableColumn<T>[];
    filteredData: T[];
    rowActions: TableRowAction<T>[];
    data: T[];
    setData: (data: T[]) => void;
    defaultSort: (a: T, b: T) => number;
    keyProp: keyof T;
}

const AppTable = <T extends Entity>({
    columns,
    filteredData,
    rowActions,
    data,
    setData,
    defaultSort,
    keyProp
}: Props<T>) => {
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc' | null>(null);

    const [sortField, setSortField] = useState<keyof T | null>(null);

    const getPostfix = useCallback((field: keyof T) => field === sortField ? sortOrder === 'asc' ? <FontAwesomeIcon icon={faChevronUp} /> : sortOrder === 'desc' ? <FontAwesomeIcon icon={faChevronDown} /> : null : null, [sortField, sortOrder]);

    const sort = useCallback((field: keyof T) => {
        const sortOrderToSet = sortOrder === null || field !== sortField ? 'asc' : sortOrder === 'asc' ? 'desc' : null;

        setSortOrder(sortOrderToSet);

        if (sortOrderToSet === null) {
            setData([...data].sort(defaultSort));

            return;
        }
        else {
            setSortField(field);
        }

        setData([...data].sort((a, b) => {
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
    }, [data, defaultSort, setData, sortField, sortOrder]);

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
                            key={String(column.key)}
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
                {filteredData?.map(data =>
                    <tr
                        key={String(data[keyProp])}
                    >
                        {columns.map(column =>
                            <td
                                onClick={!column.onClick ? undefined : () => column.onClick!(data)}
                                style={{ width: column.width }}
                                className={column.centered ? 'text-center' : ''}
                            >
                                {!column.canEdit(data) ? column.mutator ? column.mutator(data[column.key]) : data[column.key] : (
                                    <Input
                                        type={column.type}
                                        checked={column.type === 'checkbox' ? Boolean(data[column.key]) : undefined}
                                        onChange={e => column.onChange(e, data)}
                                        value={column.type === 'checkbox' ? undefined : String(data[column.key])}
                                        onKeyDown={!column.onBlur ? undefined : (event) => {
                                            if (event.key === 'Enter') {
                                                column.onBlur!(data);
                                            }
                                        }}
                                        onBlur={!column.onBlur ? undefined : () => column.onBlur!(data)}
                                        autoFocus={column.type !== 'checkbox'}
                                    />
                                )}
                            </td>
                        )}
                        <td style={{ width: '5rem' }}>
                            <div className="d-flex gap-2">
                                {rowActions.map(action =>
                                    <Button
                                        color="link"
                                        title={action.title}
                                        className="p-0"
                                        disabled={action.disabled?.(data)}
                                    >
                                        <FontAwesomeIcon
                                            icon={action.icon}
                                            onClick={() => action.onClick(data)}
                                            className={`text-${action.color}`}
                                        />
                                    </Button>
                                )}
                            </div>
                        </td>
                    </tr>
                )}
            </tbody>
        </Table>
    );
}

export default AppTable;

