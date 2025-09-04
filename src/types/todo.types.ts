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
  owner: NonNullable<AuthenticatedUserRequest["user"]>["sub"];
  todo: TodoRequest;
};

export type UpdateTodoRequest = {
  owner: NonNullable<AuthenticatedUserRequest["user"]>["sub"];
  todo: Partial<TodoRequest>;
};

export type ListTodosByOwnerRequest = {
  owner: NonNullable<AuthenticatedUserRequest["user"]>["sub"];
  page: number;
  limit: number;
  activeOnly?: boolean;
};

export type ListTodoByOwnerRequest = {
  owner: NonNullable<AuthenticatedUserRequest["user"]>["sub"];
  todoId: string;
};

export type FilteredTodo = Omit<FullTodo, "createdAt" | "updatedAt">;

export type ApiResponse<T> = {
  httpStatusCode: number;
  message: string;
  data?: T;
};

export type EntityResponse = ApiResponse<FilteredTodo>;
export type EntitiesResponse = ApiResponse<FilteredTodo[]>;
export type DeleteResponse = ApiResponse<null>;

export type TodoServices = {
  listTodos: (params: ListTodosByOwnerRequest) => Promise<EntitiesResponse>;
  listTodoByID: (params: ListTodoByOwnerRequest) => Promise<EntityResponse>;
  createTodo: (params: NewTodoRequest) => Promise<EntityResponse>;
  updateTodoByID: (params: UpdateTodoRequest) => Promise<EntityResponse>;
  deleteTodoByID: (params: ListTodoByOwnerRequest) => Promise<DeleteResponse>;
};
