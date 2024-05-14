export interface Task {
    id: number;
    title: string;
    dueDate: string | null;
    isCompleted: boolean;
    isEditingTitle: boolean;
    isEditingDueDate: boolean;
}