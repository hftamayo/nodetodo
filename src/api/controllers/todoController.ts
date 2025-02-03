import { Request, Response } from "express";
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
import { UserIdRequest } from "../../types/user.types";

export default function todoController(todoService: TodoServices) {
  return {
    getTodosHandler: async function (req: Request, res: Response) {
      try {
        const page = parseInt(req.query.page as string) || 1;
        const limit = parseInt(req.query.limit as string) || 10;
        const owner = parseInt(req.query.owner as string);
        const ListTodosByOwnerRequest: ListTodosByOwnerRequest = {
          page,
          limit,
          owner,
        };
        const result: ListTodosByOwnerResponse = await todoService.listTodos(
          ListTodosByOwnerRequest
        );
        const { httpStatusCode, message, todos } = result;
        if (httpStatusCode === 200) {
          res.status(httpStatusCode).json({
            code: httpStatusCode,
            resultMessage: message,
            todos: todos,
          });
        } else {
          res
            .status(httpStatusCode)
            .json({ code: httpStatusCode, resultMessage: message });
        }
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
        if (httpStatusCode === 200) {
          res.status(httpStatusCode).json({
            code: httpStatusCode,
            resultMessage: message,
            todo: todo,
          });
        } else {
          res
            .status(httpStatusCode)
            .json({ code: httpStatusCode, resultMessage: message });
        }
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
        if (httpStatusCode === 201) {
          return res.status(httpStatusCode).json({
            code: httpStatusCode,
            resultMessage: message,
            todo: todo,
          });
        } else {
          res
            .status(httpStatusCode)
            .json({ code: httpStatusCode, resultMessage: message });
        }
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
        const result: TodoResult = await todoService.updateTodoByID(req);
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
        res.status(500).json({
          httpStatusCode: 500,
          resultMessage: "Internal Server Error",
        });
      }
    },

    deleteTodoHandler: async function (req: OwnerTodoIdRequest, res: Response) {
      try {
        const result: TodoResult = await todoService.deleteTodoByID(req);
        const { httpStatusCode, message } = result;
        res
          .status(httpStatusCode)
          .json({ httpStatusCode, resultMessage: message });
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, deleteTodo: " + error.message);
        } else {
          console.error("todoController, deleteTodo: " + error);
        }
        res.status(500).json({
          httpStatusCode: 500,
          resultMessage: "Internal Server Error",
        });
      }
    },
  };
}
