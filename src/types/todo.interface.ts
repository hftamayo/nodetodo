import mongoose, {Document} from "mongoose";
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

export interface OwnerTodoIdRequest extends Request {
  user: UserIdRequest;
  params: {
    todoId: string;
  };
}

export interface TodoResult {
  httpStatusCode: number;
  message: string;
  todo?: Partial<TodoRequest & Document>;
  todos?: Partial<TodoRequest & Document>[];
}

export interface TodoServices {
  listActiveTodos: (req: UserIdRequest) => Promise<TodoResult>;
  listTodoByID: (req: OwnerTodoIdRequest) => Promise<TodoResult>;
  createTodo: (req: NewTodoRequest) => Promise<TodoResult>;
  updateTodoByID: (req: UpdateTodoRequest) => Promise<TodoResult>;
  deleteTodoByID: (req: OwnerTodoIdRequest) => Promise<TodoResult>;
}
