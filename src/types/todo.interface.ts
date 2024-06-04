import mongoose from "mongoose";
import { UserIdRequest } from "./user.interface";

export interface TodoSeed {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  completed: boolean;
  user: mongoose.Types.ObjectId;
}

interface TodoRequest {
  id?: string;
  title: string;
  description: string;
  completed: boolean;
  user: string;
}

export interface NewTodoRequest {
  owner: UserIdRequest;
  todo: TodoRequest;
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
  listActiveTodos: (req: UserIdRequest) => Promise<TodoResult>;
  listTodoByID: (req: OwnerTodoIdRequest) => Promise<TodoResult>;
  createTodo: (req: NewTodoRequest) => Promise<TodoResult>;
  updateTodoByID: (
    requestUserId: UserIdRequest,
    requestTodoId: TodoIdRequest,
    requestBody: Partial<TodoRequest>
  ) => Promise<TodoResult>;
  deleteTodoByID: (req: OwnerTodoIdRequest) => Promise<TodoResult>;
}
