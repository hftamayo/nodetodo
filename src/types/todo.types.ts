import mongoose from "mongoose";
import { AuthenticatedUserRequest } from "./user.types";

export type FullTodo = {
  _id: mongoose.Types.ObjectId;
  title: string;
  description: string;
  completed: boolean;
  owner: mongoose.Types.ObjectId;
  createdAt?: Date;
  updatedAt?: Date;
};

type TodoRequest = {
  _id?: string;
  title: string;
  description: string;
  completed?: boolean;
  owner: string;
};

export type NewTodoRequest = {
  owner: NonNullable<AuthenticatedUserRequest["user"]>["id"];
  todo: TodoRequest;
};

export type UpdateTodoRequest = {
  owner: NonNullable<AuthenticatedUserRequest["user"]>["id"];
  todo: Partial<TodoRequest>;
};

export type ListTodosByOwnerRequest = {
  owner: NonNullable<AuthenticatedUserRequest["user"]>["id"];
  page: number;
  limit: number;
  activeOnly?: boolean;
};

export type ListTodoByOwnerRequest = {
  owner: NonNullable<AuthenticatedUserRequest["user"]>["id"];
  todoId: string;
};

export type FilteredTodo = Omit<FullTodo, "createdAt" | "updatedAt">;

export type CreateTodoResponse = {
  httpStatusCode: number;
  message: string;
  todo?: FilteredTodo;
};

export type ListTodosByOwnerResponse = {
  httpStatusCode: number;
  message: string;
  todos?: FilteredTodo[];
};

export type ListTodoByOwnerResponse = {
  httpStatusCode: number;
  message: string;
  todo?: FilteredTodo;
};

export type UpdateTodoResponse = {
  httpStatusCode: number;
  message: string;
  todo?: FilteredTodo;
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
