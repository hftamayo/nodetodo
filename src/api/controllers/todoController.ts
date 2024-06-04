import { Request, Response } from "express";

import {
  OwnerTodoIdRequest,
  NewTodoRequest,
  TodoResult,
  TodoServices,
} from "../../types/todo.interface";
import { UserIdRequest } from "../../types/user.interface";

export default function todoController(todoService: TodoServices) {
  return {
    getTodosHandler: async function (req: UserIdRequest, res: Response) {
      try {
        const result: TodoResult = await todoService.listActiveTodos(req);
        const { httpStatusCode, message, todos } = result;
        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { httpStatusCode, resultMessage: message, activeTodos: todos }
              : { httpStatusCode, resultMessage: message }
          );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, getTodos: " + error.message);
        } else {
          console.error("todoController, getTodos: " + error);
        }
        res.status(500).json({
          httpStatusCode: 500,
          resultMessage: "Internal Server Error",
        });
      }
    },

    getTodoHandler: async function (req: OwnerTodoIdRequest, res: Response) {
      try {
        const result: TodoResult = await todoService.listTodoByID(
          req.user,
          req.params.id
        );
        const { httpStatusCode, message, todo } = result;
        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { httpStatusCode, resultMessage: message, searchTodo: todo }
              : { httpStatusCode, resultMessage: message }
          );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, getTodo: " + error.message);
        } else {
          console.error("todoController, getTodo: " + error);
        }
        res.status(500).json({
          httpStatusCode: 500,
          resultMessage: "Internal Server Error",
        });
      }
    },

    newTodoHandler: async function (req: NewTodoRequest, res: Response) {
      try {
        if (
          !req.todo.title ||
          !req.todo.description ||
          !req.todo.completed ||
          !req.todo.user
        ) {
          return res.status(400).json({
            httpStatusCode: 400,
            resultMessage: "Missing required fields",
          });
        }

        const result: TodoResult = await todoService.createTodo(
          req.owner,
          req.todo
        );

        const { httpStatusCode, message, todo } = result;

        res
          .status(httpStatusCode)
          .json(
            httpStatusCode === 200
              ? { httpStatusCode, resultMessage: message, newTodo: todo }
              : { httpStatusCode, resultMessage: message }
          );
      } catch (error: unknown) {
        if (error instanceof Error) {
          console.error("todoController, newTodo: " + error.message);
        } else {
          console.error("todoController, newTodo: " + error);
        }
        res.status(500).json({
          httpStatusCode: 500,
          resultMessage: "Internal Server Error",
        });
      }
    },

    updateTodoHandler: async function (
      req: OwnerTodoBodyRequest,
      res: Response
    ) {
      try {
        if (!req.todoId) {
          throw new Error("Missing todoId");
        }
        const result: TodoResult = await todoService.updateTodoByID(
          req.owner,
          req.todoId,
          req.todo
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
        res.status(500).json({
          httpStatusCode: 500,
          resultMessage: "Internal Server Error",
        });
      }
    },

    deleteTodoHandler: async function (req: OwnerTodoIdRequest, res: Response) {
      try {
        const result: TodoResult = await todoService.deleteTodoByID(
          req.user,
          req.params.id
        );
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
