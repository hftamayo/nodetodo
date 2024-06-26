import { Response } from "express";

import {
  OwnerTodoIdRequest,
  NewTodoRequest,
  UpdateTodoRequest,
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
        if (httpStatusCode === 200 && todos?.length) {
          res.status(httpStatusCode).json({
            httpStatusCode,
            resultMessage: message,
            activeTodos: todos,
          });
        } else {
          res
            .status(httpStatusCode)
            .json({ httpStatusCode, resultMessage: message });
        }
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
        const result: TodoResult = await todoService.listTodoByID(req);
        const { httpStatusCode, message, todo } = result;
        if (httpStatusCode === 200 && todo?.toObject) {
          // const todoObject = todo.toObject();
          // const { user, ...filteredTodo } = todoObject;
          res.status(httpStatusCode).json({
            httpStatusCode,
            resultMessage: message,
            searchTodo: todo,
          });
        } else {
          res
            .status(httpStatusCode)
            .json({ httpStatusCode, resultMessage: message });
        }
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
        const result: TodoResult = await todoService.createTodo(req);

        const { httpStatusCode, message, todo } = result;
        if (httpStatusCode === 200 && todo?.toObject) {
          // const todoObject = todo.toObject();
          // const { user, ...filteredTodo } = todoObject;
          return res.status(httpStatusCode).json({
            httpStatusCode,
            resultMessage: message,
            newTodo: todo,
          });
        } else {
          res
            .status(httpStatusCode)
            .json({ httpStatusCode, resultMessage: message });
        }
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
