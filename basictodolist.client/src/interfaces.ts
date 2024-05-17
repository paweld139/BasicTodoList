import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";

export interface Entity {
    [key: string]: ReactNode;
}

export interface Task extends Entity {
    title: string;
    dueDate: string | null;
    isCompleted: boolean;
    orderIndex: number;
    isEditingTitle: boolean;
    isEditingDueDate: boolean;
}

export interface TaskFilter {
    title: string;
    dueDateFrom: string;
    dueDateTo: string;
}

export interface TableColumn<T extends Entity> {
    label: string;
    key: keyof T;
    centered?: boolean;
    onClick?: (data: T) => void;
    type: 'text' | 'datetime-local' | 'checkbox';
    canEdit: (data: T) => boolean;
    onChange: (event: React.ChangeEvent<HTMLInputElement>, data: T) => void;
    onBlur?: (data: T) => void;
    width?: string;
    mutator?: (value: ReactNode) => ReactNode;
}

export interface TableRowAction<T extends Entity> {
    title: string;
    onClick: (data: T) => void;
    icon: IconDefinition;
    disabled?: (data: T) => boolean;
    color: string;
}

export interface FormInput<T> {
    key: keyof T;
    label: string;
    type: 'search' | 'datetime-local';
    group?: number
}