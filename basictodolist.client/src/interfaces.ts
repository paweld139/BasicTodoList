import { IconDefinition } from "@fortawesome/free-solid-svg-icons";
import { ReactNode } from "react";

export interface Entity {
    id: number;
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
}

export interface TableRowAction<T extends Entity> {
    title: string;
    onClick: (data: T) => void;
    icon: IconDefinition;
    disabled?: (data: T) => boolean;
    color: string;
}