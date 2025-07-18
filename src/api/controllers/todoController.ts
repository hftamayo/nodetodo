import { Response } from "express";
import {
  ListTodosByOwnerRequest,
  ListTodoByOwnerRequest,
  NewTodoRequest,
  UpdateTodoRequest,
  EntityResponse,
  EntitiesResponse,
  DeleteResponse,
  TodoServices,
} from "@/types/todo.types";

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
        const result: EntitiesResponse = await todoService.listTodos(
          listTodosByOwnerRequest
        );
        const { httpStatusCode, message, data } = result;

        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { code: httpStatusCode, resultMessage: message, todos: data }
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
        const result: EntityResponse = await todoService.listTodoByID(req);
        const { httpStatusCode, message, data } = result;

        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { code: httpStatusCode, resultMessage: message, todo: data }
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
        const result: EntityResponse = await todoService.createTodo(req);
        const { httpStatusCode, message, data } = result;

        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 201
              ? { code: httpStatusCode, resultMessage: message, todo: data }
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
        const result: EntityResponse = await todoService.updateTodoByID(req);
        const { httpStatusCode, message, data } = result;
        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { httpStatusCode, resultMessage: message, updateTodo: data }
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
        const result: DeleteResponse = await todoService.deleteTodoByID(req);
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
