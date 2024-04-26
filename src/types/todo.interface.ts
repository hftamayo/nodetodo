import { UserIdRequest } from "./user.interface";

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

export interface OwnerTodoBodyRequest{
    owner: string;
    todoId?: string;
    todo: Partial<TodoRequest>;
}

export interface OwnerTodoIdRequest extends Request {
    user: UserIdRequest;
    params: {
        id: TodoIdRequest;
    }
}


export interface TodoResult{
    httpStatusCode: number;
    message: string;
    todo?: Partial<TodoRequest>;
    todos?: Partial<TodoRequest>[];
}