import mongoose, { Document } from "mongoose";
import { UserIdRequest } from "./user.types";

export type TodoSeed = {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  completed: boolean;
  user: mongoose.Types.ObjectId;
};

type TodoRequest = {
  _id?: string;
  title: string;
  description: string;
  completed: boolean;
  user: string;
};

export type NewTodoRequest = {
  owner: UserIdRequest;
  todo: TodoRequest;
};

export type UpdateTodoRequest = {
  owner: UserIdRequest;
  todo: Partial<TodoRequest>;
};

export type OwnerTodoIdRequest = Request & {
  user: UserIdRequest;
  params: {
    todoId: string;
  };
};

export type TodoResult = {
  httpStatusCode: number;
  message: string;
  todo?: Partial<TodoRequest & Document>;
  todos?: Partial<TodoRequest & Document>[];
};

export type TodoServices = {
  listActiveTodos: (req: UserIdRequest) => Promise<TodoResult>;
  listTodoByID: (req: OwnerTodoIdRequest) => Promise<TodoResult>;
  createTodo: (req: NewTodoRequest) => Promise<TodoResult>;
  updateTodoByID: (req: UpdateTodoRequest) => Promise<TodoResult>;
  deleteTodoByID: (req: OwnerTodoIdRequest) => Promise<TodoResult>;
};
