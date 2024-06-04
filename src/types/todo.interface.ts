import mongoose from "mongoose";
import { UserIdRequest } from "./user.interface";

export interface TodoSeed {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  completed: boolean;
  user: mongoose.Types.ObjectId;
}

export interface TodoRequest {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  user: string;
}

export interface UpdateTodoRequest {
  owner: UserIdRequest;
  todo: Partial<TodoRequest>;
}

/*
this interface won't be use alone because it's necessary
to check the ownership always for sec concerns
*/
interface TodoIdRequest {
  todoId: string;
}

export interface OwnerTodoIdRequest extends Request {
  user: UserIdRequest;
  params: {
    id: TodoIdRequest;
  };
}

export interface TodoResult {
  httpStatusCode: number;
  message: string;
  todo?: Partial<TodoRequest>;
  todos?: Partial<TodoRequest>[];
}

export interface TodoServices {
  listActiveTodos: (requestUserId: UserIdRequest) => Promise<TodoResult>;
  listTodoByID: (
    requestUserId: UserIdRequest,
    requestTodoId: TodoIdRequest
  ) => Promise<TodoResult>;
  createTodo: (
    requestUserId: UserIdRequest,
    requestBody: Partial<TodoRequest>
  ) => Promise<TodoResult>;
  updateTodoByID: (
    requestUserId: UserIdRequest,
    requestTodoId: TodoIdRequest,
    requestBody: Partial<TodoRequest>
  ) => Promise<TodoResult>;
  deleteTodoByID: (
    requestUserId: UserIdRequest,
    requestTodoId: TodoIdRequest
  ) => Promise<TodoResult>;
}
