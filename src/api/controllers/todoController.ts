import { Response } from "express";

import {
  TodoRequest,
  TodoIdRequest,
  OwnerTodoIdRequest,
  TodoResult,
  OwnerTodoBodyRequest,
} from "../../types/todo.interface";
import { UserIdRequest } from "../../types/user.interface";

let listActiveTodos: (newActiveTodos: UserIdRequest) => Promise<TodoResult>;
let listTodoByID: (
  params: UserIdRequest,
  todoIdRequest: TodoIdRequest
) => Promise<TodoResult>;
let createTodo: (
  params: UserIdRequest,
  requestBody: Partial<TodoRequest>
) => Promise<TodoResult>;
let updateTodoByID: (
  params: UserIdRequest,
  requestTodoId: TodoIdRequest,
  requestBody: Partial<TodoRequest>
) => Promise<TodoResult>;
let deleteTodoByID: (
  userId: UserIdRequest,
  todoId: TodoIdRequest
) => Promise<TodoResult>;

const todoController = {
  setActiveTodos: function (
    newActiveTodos: (newActiveTodos: UserIdRequest) => Promise<TodoResult>
  ) {
    listActiveTodos = newActiveTodos;
  },
  setTodoByID: function (
    newTodoByID: (
      params: UserIdRequest,
      todoIdRequest: TodoIdRequest
    ) => Promise<TodoResult>
  ) {
    listTodoByID = newTodoByID;
  },
  setCreateTodo: function (
    newCreateTodo: (
      params: UserIdRequest,
      requestBody: Partial<TodoRequest>
    ) => Promise<TodoResult>
  ) {
    createTodo = newCreateTodo;
  },
  setUpdateTodoByID: function (
    newUpdateTodoByID: (
      params: UserIdRequest,
      requestTodoId: TodoIdRequest,
      requestBody: Partial<TodoRequest>
    ) => Promise<TodoResult>
  ) {
    updateTodoByID = newUpdateTodoByID;
  },
  setDeleteTodoByID: function (
    newDeleteTodoByID: (
      userId: UserIdRequest,
      todoId: TodoIdRequest
    ) => Promise<TodoResult>
  ) {
    deleteTodoByID = newDeleteTodoByID;
  },

  getTodosHandler: async function (req: UserIdRequest, res: Response) {
    try {
      const { httpStatusCode, message, todos } = await listActiveTodos(req);
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
      res
        .status(500)
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  getTodoHandler: async function (req: OwnerTodoIdRequest, res: Response) {
    try {
      const { httpStatusCode, message, todo } = await listTodoByID(
        req.user,
        req.params.id
      );
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
      res
        .status(500)
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  newTodoHandler: async function (req: OwnerTodoBodyRequest, res: Response) {
    try {
      const { httpStatusCode, message, todo } = await createTodo(
        req.owner,
        req.todo
      );

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
      res
        .status(500)
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  updateTodoHandler: async function (req: OwnerTodoBodyRequest, res: Response) {
    try {
      if (!req.todoId) {
        throw new Error("Missing todoId");
      }
      const { httpStatusCode, message, todo } = await updateTodoByID(
        req.owner,
        req.todoId,
        req.todo
      );
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
      res
        .status(500)
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },

  deleteTodoHandler: async function (req: OwnerTodoIdRequest, res: Response) {
    try {
      const { httpStatusCode, message } = await deleteTodoByID(
        req.user,
        req.params.id
      );
      res
        .status(httpStatusCode)
        .json({ httpStatusCode, resultMessage: message });
    } catch (error: unknown) {
      if (error instanceof Error) {
        console.error("todoController, deleteTodo: " + error.message);
      } else {
        console.error("todoController, deleteTodo: " + error);
      }
      res
        .status(500)
        .json({ httpStatusCode: 500, resultMessage: "Internal Server Error" });
    }
  },
};

export default todoController;
