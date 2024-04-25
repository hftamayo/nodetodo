import { Request, Response } from "express";
import {
  TodoRequest,
  TodoIdRequest,
  TodoResult,
} from "../../types/todo.interface";
import { UserIdRequest } from "../../types/user.interface";

let listActiveTodos: (newActiveTodos: UserIdRequest) => Promise<TodoResult>;
let listTodoByID: (
  params: UserIdRequest,
  todoIdRequest: TodoIdRequest
) => Promise<TodoResult>;
let createTodo: (
  params: UserIdRequest,
  requestBody: TodoRequest
) => Promise<TodoResult>;
let updateTodoByID: (
  params: UserIdRequest,
  requestTodoId: TodoIdRequest,
  requestBody: TodoRequest
) => Promise<TodoResult>;
let deleteTodoByID: (
  params: UserIdRequest,
  todoIdRequest: TodoIdRequest
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
      requestBody: TodoRequest
    ) => Promise<TodoResult>
  ) {
    createTodo = newCreateTodo;
  },
  setUpdateTodoByID: function (
    newUpdateTodoByID: (
      params: UserIdRequest,
      requestTodoId: TodoIdRequest,
      requestBody: TodoRequest
    ) => Promise<TodoResult>
  ) {
    updateTodoByID = newUpdateTodoByID;
  },
  setDeleteTodoByID: function (
    newDeleteTodoByID: (
      params: UserIdRequest,
      todoIdRequest: TodoIdRequest
    ) => Promise<TodoResult>
  ) {
    deleteTodoByID = newDeleteTodoByID;
  },

  getTodosHandler: async function (req: TodoIdRequest, res: Response) {
    try {
      const { httpStatusCode, message, todos } = await listActiveTodos(
        req.user
      );
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

  getTodoHandler: async function (req: UserIdRequest, res: Response) {
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

  newTodoHandler: async function (req, res) {
    try {
      const { httpStatusCode, message, todo } = await createTodo(
        req.user,
        req.body
      );
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

  updateTodoHandler: async function (req, res) {
    try {
      const { httpStatusCode, message, todo } = await updateTodoByID(
        req.user,
        req.params.id,
        req.body
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

  deleteTodoHandler: async function (req, res) {
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

module.exports = todoController;
