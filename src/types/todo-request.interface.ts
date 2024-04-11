export interface TodoRequestBody {
    id: string;
    title: string;
    description: string;
    completed: boolean;
    user: string;
}

export type PartialTodoRequestBody = Partial<TodoRequestBody>;

export interface TodoId {
    id: string;
}