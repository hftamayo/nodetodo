import mongoose from "mongoose";
import { UserIdRequest } from "./user.types";

export type FullTodo = {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  completed: boolean;
  owner: mongoose.Types.ObjectId;
};

type TodoRequest = {
  _id?: string;
  title: string;
  description: string;
  completed: boolean;
  owner: string;
};

export type NewTodoRequest = {
  owner: UserIdRequest;
  todo: TodoRequest;
};

export type UpdateTodoRequest = {
  owner: UserIdRequest;
  todo: Partial<TodoRequest>;
};

export type ListTodosByOwnerRequest = {
  owner: UserIdRequest;
  page: number;
  limit: number;
  activeOnly?: boolean;
};

export type ListTodoByOwnerRequest = {
  owner: UserIdRequest;
  params: {
    todoId: string;
  };
};

export type CreateTodoResponse = {
  httpStatusCode: number;
  message: string;
  todo?: FullTodo;
};

export type ListTodosByOwnerResponse = {
  httpStatusCode: number;
  message: string;
  todos?: FullTodo[];
};

export type ListTodoByOwnerResponse = {
  httpStatusCode: number;
  message: string;
  todo?: FullTodo;
};

export type UpdateTodoResponse = {
  httpStatusCode: number;
  message: string;
  todo?: FullTodo;
};

export type DeleteTodoByIdResponse = {
  httpStatusCode: number;
  message: string;
};

export type TodoServices = {
  listTodos: (
    params: ListTodosByOwnerRequest
  ) => Promise<ListTodosByOwnerResponse>;
  listTodoByID: (
    params: ListTodoByOwnerRequest
  ) => Promise<ListTodoByOwnerResponse>;
  createTodo: (params: NewTodoRequest) => Promise<CreateTodoResponse>;
  updateTodoByID: (params: UpdateTodoRequest) => Promise<UpdateTodoResponse>;
  deleteTodoByID: (
    params: ListTodoByOwnerRequest
  ) => Promise<DeleteTodoByIdResponse>;
};
