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

import { useCallback } from "react";

interface Props<T extends Entity> {
    columns: TableColumn<T>[];
    sort: (key: keyof T) => void;
    filteredData: T[];
    rowActions: TableRowAction<T>[];
    sortOrder: 'asc' | 'desc' | null;
    sortField: keyof T | null;
}

const AppTable = <T extends Entity>({
    columns,
    sort,
    filteredData,
    rowActions,
    sortOrder,
    sortField
}: Props<T>) => {
    const getPostfix = useCallback((field: keyof T) => field === sortField ? sortOrder === 'asc' ? <FontAwesomeIcon icon={faChevronUp} /> : sortOrder === 'desc' ? <FontAwesomeIcon icon={faChevronDown} /> : null : null, [sortField, sortOrder]);

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
                        key={data.id}
                    >
                        {columns.map(column =>
                            <td
                                onClick={!column.onClick ? undefined : () => column.onClick!(data)}
                                style={{ width: column.width }}
                                className={column.centered ? 'text-center' : ''}
                            >
                                {!column.canEdit(data) ? data[column.key] : (
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

