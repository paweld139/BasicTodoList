export interface Task {
    id: number;
    title: string;
    dueDate: string | null;
    isCompleted: boolean;
    orderIndex: number;
    isEditingTitle: boolean;
    isEditingDueDate: boolean;
}