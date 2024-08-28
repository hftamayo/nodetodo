import { Request, Response } from "express";
import {
  mockTodos,
  mockTodoRoleUser,
  mockInvalidTodo,
  mockTodoForUpdate,
  mockDeleteTodo,
} from "../mocks/todo.mock";
import { mockUserRoleUser } from "../mocks/user.mock";
import {
  NewTodoRequest,
  UpdateTodoRequest,
  OwnerTodoIdRequest,
  TodoServices,
} from "../../src/types/todo.interface";
import { UserIdRequest } from "../../src/types/user.interface";
import todoController from "../../src/api/controllers/todoController";
import { cookie } from "express-validator";

describe("todoController Unit Tests", () => {
  let req:
    | NewTodoRequest
    | UpdateTodoRequest
    | OwnerTodoIdRequest
    | UserIdRequest;
  let res: Response<any, Record<string, any>>;
  let json: jest.Mock;
  let listActiveTodosStub: jest.Mock<any, any, any>;
  let listActiveTodoStub: jest.Mock<any, any, any>;
  let newTodoStub: jest.Mock<any, any, any>;
  let updateTodoStub: jest.Mock<any, any, any>;
  let deleteTodoStub: jest.Mock<any, any, any>;
  let controller: ReturnType<typeof todoController>;
  let mockTodoService: TodoServices;

  beforeEach(() => {
    req = {} as
      | NewTodoRequest
      | UpdateTodoRequest
      | OwnerTodoIdRequest
      | UserIdRequest;
    json = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response<any, Record<string, any>>;

    listActiveTodosStub = jest.fn((userId) => {
      if (userId === mockUserRoleUser._id.toString()) {
        return Promise.resolve({
          httpStatusCode: 200,
          message: "Tasks found",
          todos: mockTodos,
        });
      }
      return Promise.resolve({
        httpStatusCode: 404,
        message: "No active tasks found for active user",
      });
    });

    listActiveTodoStub = jest.fn((todo) => {
      if (todo._id === mockInvalidTodo._id) {
        return Promise.resolve({
          httpStatusCode: 404,
          message: "Task Not Found",
        });
      }
      return Promise.resolve({
        httpStatusCode: 200,
        message: "Todo found",
      });
    });
    newTodoStub = jest.fn((todo) => {
      if (todo._id === mockInvalidTodo._id) {
        return Promise.resolve({
          httpStatusCode: 400,
          message: "Title already taken",
        });
      }
      return Promise.resolve({
        httpStatusCode: 200,
        message: "Todo created Successfully",
      });
    });
    updateTodoStub = jest.fn();
    deleteTodoStub = jest.fn((todo) => {
      if (todo._id === mockInvalidTodo._id) {
        return Promise.resolve({
          httpStatusCode: 404,
          message: "Todo Not Found",
        });
      }
      return Promise.resolve({
        httpStatusCode: 200,
        message: "Todo Deleted Successfully",
      });
    });

    mockTodoService = {
      listActiveTodos: listActiveTodosStub,
      listTodoByID: listActiveTodoStub,
      createTodo: newTodoStub,
      updateTodoByID: updateTodoStub,
      deleteTodoByID: deleteTodoStub,
    };

    controller = todoController(mockTodoService);
  });

  afterEach(() => {
    jest.restoreAllMocks();
  });

  describe("getTodos method", () => {
    it("should return a list of todos associated to an active user", async () => {
      const req: UserIdRequest = { userId: mockUserRoleUser._id.toString() };

      await controller.getTodosHandler(req, res);

      expect(listActiveTodosStub).toHaveBeenCalledTimes(1);
      expect(listActiveTodosStub).toHaveBeenCalledWith(req.userId);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Tasks found",
        activeTodos: mockTodos,
      });
    });

    it("should return empty list when no tasks are associated with an active user", async () => {});
  });

  describe("getTodo method", () => {
    it("should return an existing todo", async () => {
      const req: OwnerTodoIdRequest = {
        user: { userId: mockTodoRoleUser.user.toString() },
        params: { todoId: mockTodoRoleUser._id.toString() },
      } as OwnerTodoIdRequest;

      await controller.getTodoHandler(req, res);

      expect(listActiveTodoStub).toHaveBeenCalledTimes(1);
      expect(listActiveTodoStub).toHaveBeenCalledWith(req.params.todoId);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Todo found",
        searchTodo: mockTodoRoleUser,
      });
    });
    it("should return an error message when todo is not found", async () => {});
  });

  describe("createTodo method", () => {
    it("should create a new todo", async () => {
      const convertTodoRoleUser = {
        ...mockTodoRoleUser,
        _id: mockTodoRoleUser._id.toString(),
        user: mockTodoRoleUser.user.toString(),
      };

      const req: NewTodoRequest = {
        owner: { userId: mockUserRoleUser._id.toString() },
        todo: convertTodoRoleUser,
      };

      await controller.newTodoHandler(req, res);

      expect(newTodoStub).toHaveBeenCalledTimes(1);
      expect(newTodoStub).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Todo created successfully",
        newTodo: mockTodoRoleUser,
      });
    });
    it("should restrict create an existing todo", async () => {});
  });

  describe("updateTodo method", () => {
    it("should update a todo", async () => {
      req = {
        owner: { userId: mockTodoRoleUser.user.toString() },
        todo: {
          ...mockTodoForUpdate,
          _id: mockTodoForUpdate._id.toString(),
          user: mockTodoForUpdate.user.toString(),
        },
      };

      await controller.updateTodoHandler(req, res);

      expect(updateTodoStub).toHaveBeenCalledTimes(1);
      expect(updateTodoStub).toHaveBeenCalledWith(200);
      expect(updateTodoStub).toHaveBeenCalledWith({
        owner: { userId: mockTodoRoleUser.user.toString() },
        todo: {
          ...mockTodoForUpdate,
          _id: mockTodoForUpdate._id?.toString(),
          user: mockTodoForUpdate.user.toString(),
        },
      });
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Todo updated successfully",
        updateTodo: {
          ...mockTodoForUpdate,
          _id: mockTodoForUpdate._id?.toString(),
          user: mockTodoForUpdate.user.toString(),
        },
      });
    });
    it("should restrict update of a todo associated to another user", async () => {});
  });

  describe("deleteTodo method", () => {
    it("should delete a todo", async () => {
      const req: OwnerTodoIdRequest = {
        user: { userId: mockTodoRoleUser.user.toString() },
        params: { todoId: mockTodoRoleUser._id.toString() },
      } as OwnerTodoIdRequest;

      await controller.deleteTodoHandler(req, res);

      expect(deleteTodoStub).toHaveBeenCalledTimes(1);
      expect(deleteTodoStub).toHaveBeenCalledWith(req.params.todoId);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Todo Deleted Successfully",
      });
    });
    it("should restrict delete of a todo associated to another user", async () => {});
  });
});
