import { Response } from "express";
import {
  ListTodosByOwnerRequest,
  ListTodoByOwnerRequest,
  NewTodoRequest,
  UpdateTodoRequest,
  ListTodosByOwnerResponse,
  ListTodoByOwnerResponse,
  CreateTodoResponse,
  UpdateTodoResponse,
  DeleteTodoByIdResponse,
  TodoServices,
} from "../../types/todo.types";

export default function todoController(todoService: TodoServices) {
  return {
    getTodosHandler: async function (
      req: ListTodosByOwnerRequest,
      res: Response
    ) {
      try {
        const { page, limit, owner, activeOnly } = req;
        const listTodosByOwnerRequest: ListTodosByOwnerRequest = {
          page,
          limit,
          owner,
          activeOnly,
        };
        const result: ListTodosByOwnerResponse = await todoService.listTodos(
          listTodosByOwnerRequest
        );
        const { httpStatusCode, message, todos } = result;

        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { code: httpStatusCode, resultMessage: message, todos: todos }
              : { code: httpStatusCode, resultMessage: message }
          );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, getTodos: " + error.message);
        } else {
          console.error("todoController, getTodos: " + error);
        }
      }
    },

    getTodoHandler: async function (
      req: ListTodoByOwnerRequest,
      res: Response
    ) {
      try {
        const result: ListTodoByOwnerResponse = await todoService.listTodoByID(
          req
        );
        const { httpStatusCode, message, todo } = result;

        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { code: httpStatusCode, resultMessage: message, todo: todo }
              : { code: httpStatusCode, resultMessage: message }
          );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, getTodo: " + error.message);
        } else {
          console.error("todoController, getTodo: " + error);
        }
      }
    },

    newTodoHandler: async function (req: NewTodoRequest, res: Response) {
      try {
        const result: CreateTodoResponse = await todoService.createTodo(req);
        const { httpStatusCode, message, todo } = result;

        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 201
              ? { code: httpStatusCode, resultMessage: message, todo: todo }
              : { code: httpStatusCode, resultMessage: message }
          );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, newTodo: " + error.message);
        } else {
          console.error("todoController, newTodo: " + error);
        }
      }
    },

    updateTodoHandler: async function (req: UpdateTodoRequest, res: Response) {
      try {
        const result: UpdateTodoResponse = await todoService.updateTodoByID(
          req
        );
        const { httpStatusCode, message, todo } = result;
        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { httpStatusCode, resultMessage: message, updateTodo: todo }
              : { httpStatusCode, resultMessage: message }
          );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, updateTodo: " + error.message);
        } else {
          console.error("todoController, updateTodo: " + error);
        }
      }
    },

    deleteTodoHandler: async function (
      req: ListTodoByOwnerRequest,
      res: Response
    ) {
      try {
        const result: DeleteTodoByIdResponse = await todoService.deleteTodoByID(
          req
        );
        const { httpStatusCode, message } = result;
        res
          .status(httpStatusCode)
          .json({ code: httpStatusCode, resultMessage: message });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, deleteTodo: " + error.message);
        } else {
          console.error("todoController, deleteTodo: " + error);
        }
      }
    },
  };
}
