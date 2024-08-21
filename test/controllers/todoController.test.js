import {Request, Response} from "express";
import {
  newStandardTodo,
  newTodoSupervisor,
  todoForUpdate,
  deleteTodo,
  invalidStandardTodo,
} from "../mocks/todo.mock";
import {
  mockUserInvalid,
  mockUserRoleUser,
  mockUserRoleSupervisor,
} from "../mocks/user.mock";
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
  let req: NewTodoRequest | UpdateTodoRequest | OwnerTodoIdRequest | UserIdRequest;
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
    req = {} as NewTodoRequest | UpdateTodoRequest | OwnerTodoIdRequest | UserIdRequest;
    json = jest.fn();
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    } as unknown as Response<any, Record<string, any>>;

    listActiveTodosStub = jest.fn();
    listActiveTodoStub = jest.fn();
    newTodoStub = jest.fn();
    updateTodoStub = jest.fn();
    deleteTodoStub = jest.fn();

    mockTodoService = {
      listActiveTodos: listActiveTodosStub,
      listActiveTodo: listActiveTodoStub,
      createTodo: newTodoStub,
      updateTodo: updateTodoStub,
      deleteTodo: deleteTodoStub,
    };

    controller = todoController(mockTodoService);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("getTodos method", () => {
    it("should return a list of todos associated to an active user", async () => {
      req = {
        user: mockUserSupervisor.id,
      };

      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });

      listActiveTodosStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "Tasks found",
        todos: todoSupervisor,
      });

      todoController.setActiveTodos(listActiveTodosStub);

      await todoController.getTodosHandler(req, res);

      expect(listActiveTodosStub).toHaveBeenCalledTimes(1);
      expect(listActiveTodosStub).toHaveBeenCalledWith(todos);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Tasks found",
        activeTodos: todos,
      });
    });

    it("should return empty list when no tasks are associated with an active user", async () => {
    });
  });

  describe("getTodo method", () => {
    it("should return an existing todo", async () => {
      req = {
        user: mockUserSupervisor.id,
        params: { id: todoSupervisor._id },
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });

      listActiveTodoStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "Todo found",
        todo: todoSupervisor,
      });

      todoController.setTodoByID(listActiveTodoStub);

      await todoController.getTodoHandler(req, res);

      expect(listActiveTodoStub).toHaveBeenCalledTimes(1);
      expect(listActiveTodoStub).toHaveBeenCalledWith(todoId);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Todo found",
        searchTodo: todoSupervisor,
      });
    });
    it("should return an error message when todo is not found", async () => {
    });
  });

  describe("createTodo method", () => {
    it("should create a new todo", async () => {
      req = {
        user: mockUserSupervisor.id,
        body: newTodo,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });

      newTodoStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "Todo created successfully",
        todo: newTodo,
      });

      todoController.setCreateTodo(newTodoStub);

      await todoController.newTodoHandler(req, res);

      expect(newTodoStub).toHaveBeenCalledTimes(1);
      expect(newTodoStub).toHaveBeenCalledWith(200);
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Todo created successfully",
        newTodo: newTodo,
      });
    });
    it("should restrict create an existing todo", async () => {
    });
  });

  describe("updateTodo method", () => {
    it("should update a todo", async () => {
      req = {
        user: mockUserSupervisor.id,
        params: { id: todoSupervisor.id },
        body: todoForUpdate,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });

      updateTodoStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        resultMessage: "Todo updated successfully",
        updateTodo: todoSupervisor,
      });

      todoController.setUpdateTodoByID(updateTodoStub);

      await todoController.updateTodoHandler(req, res);

      sinon.assert.calledOnce(updateTodoStub);
      sinon.assert.calledWith(
        updateTodoStub,
        req.user,
        req.params.id,
        req.body
      );

      expect(updateTodoStub).toHaveBeenCalledTimes(1);
      expect(updateTodoStub).toHaveBeenCalledWith(200);
      expect(updateTodoStub).toHaveBeenCalledWith(
        mockTodoSupervisor,
        expectedUpdateProperties
      );
      expect(json).toHaveBeenCalledTimes(1);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Todo updated successfully",
        updateTodo: todoSupervisor,
      });
    });
    it("should restrict update of a todo associated to another user", async () => {
    });
  });

  describe("deleteTodo method", () => {
    it("should delete a todo", async () => {
      req = {
        user: mockUserSupervisor.id,
        params: { id: deleteTodo.id },
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });

      deleteTodoStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "Todo Deleted Successfully",
      });

      todoController.setDeleteTodoByID(deleteTodoStub);

      await todoController.deleteTodoHandler(req, res);

      expect(deleteTodoStub).toHaveBeenCalledTimes(1);
      expect(deleteTodoStub).toHaveBeenCalledWith(todoId);
      expect(json).toHaveBeenCalledWith({
        resultMessage: "Todo Deleted Successfully",
      });
    });
    it("should restrict delete of a todo associated to another user", async () => {
    });
  });
});
