export interface TodoRequest{
    id?: string;
    title: string;
    description: string;
    completed: boolean;
    user: string;
}

export interface TodoIdRequest{
    todoId: string;
}

export interface UpdateTodoRequest{
    owner: string;
    todoId: string;
    todo: Partial<TodoRequest>;
}

export interface TodoResult{
    httpStatusCode: number;
    message: string;
    todo?: Partial<TodoRequest>;
    todos?: Partial<TodoRequest>[];
}