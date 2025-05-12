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
  TodoServices,
  ListTodosByOwnerRequest,
  ListTodoByOwnerRequest,
} from "@/types/todo.types";
import todoController from "../../src/api/controllers/todoController";
import todoService from "@/services/todoService";
import { mockTodoRoleSupervisor } from "../mocks/todo.mock";
import { mockUserRoleSupervisor } from "../mocks/user.mock";

jest.mock("@/services/todoService");

describe("TodoController Unit Tests", () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let mockJson: jest.Mock;
  let mockStatus: jest.Mock;
  let mockTodoService: TodoServices;

  beforeEach(() => {
    mockJson = jest.fn();
    mockStatus = jest.fn().mockReturnValue({ json: mockJson });
    mockResponse = {
      json: mockJson,
      status: mockStatus,
    };
    mockRequest = {};
    mockTodoService = {
      listTodos: jest.fn(),
      listTodoByID: jest.fn(),
      createTodo: jest.fn(),
      updateTodoByID: jest.fn(),
      deleteTodoByID: jest.fn(),
    };
    jest.clearAllMocks();
  });

  describe("getTodosHandler", () => {
    it("should return a list of todos with pagination", async () => {
      // Arrange
      const listTodosRequest: ListTodosByOwnerRequest = {
        owner: mockUserRoleUser._id.toString(),
        page: 1,
        limit: 10,
        activeOnly: false,
      };
      mockRequest.body = listTodosRequest;

      const mockTodos = [mockTodoRoleUser, mockTodoRoleSupervisor];
      (mockTodoService.listTodos as jest.Mock).mockResolvedValue({
        httpStatusCode: 200,
        message: "TASKS_FOUND",
        todos: mockTodos,
      });

      // Act
      await todoController(mockTodoService).getTodosHandler(
        listTodosRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockTodoService.listTodos).toHaveBeenCalledWith(listTodosRequest);
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        code: 200,
        resultMessage: "TASKS_FOUND",
        todos: mockTodos,
      });
    });

    it("should handle errors when listing todos", async () => {
      // Arrange
      const listTodosRequest: ListTodosByOwnerRequest = {
        owner: mockUserRoleUser._id.toString(),
        page: 1,
        limit: 10,
        activeOnly: false,
      };
      mockRequest.body = listTodosRequest;

      (mockTodoService.listTodos as jest.Mock).mockResolvedValue({
        httpStatusCode: 404,
        message: "TASKS_NOT_FOUND",
      });

      // Act
      await todoController(mockTodoService).getTodosHandler(
        listTodosRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        code: 404,
        resultMessage: "TASKS_NOT_FOUND",
      });
    });
  });

  describe("getTodoHandler", () => {
    it("should return a todo when found", async () => {
      // Arrange
      const listTodoRequest: ListTodoByOwnerRequest = {
        owner: mockUserRoleUser._id.toString(),
        todoId: mockTodoRoleUser._id.toString(),
      };
      mockRequest.body = listTodoRequest;

      (mockTodoService.listTodoByID as jest.Mock).mockResolvedValue({
        httpStatusCode: 200,
        message: "ENTITY_FOUND",
        todo: mockTodoRoleUser,
      });

      // Act
      await todoController(mockTodoService).getTodoHandler(
        listTodoRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockTodoService.listTodoByID).toHaveBeenCalledWith(
        listTodoRequest
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        code: 200,
        resultMessage: "ENTITY_FOUND",
        todo: mockTodoRoleUser,
      });
    });

    it("should handle errors when todo is not found", async () => {
      // Arrange
      const listTodoRequest: ListTodoByOwnerRequest = {
        owner: mockUserRoleUser._id.toString(),
        todoId: "nonexistentid",
      };
      mockRequest.body = listTodoRequest;

      (mockTodoService.listTodoByID as jest.Mock).mockResolvedValue({
        httpStatusCode: 404,
        message: "ENTITY_NOT_FOUND",
      });

      // Act
      await todoController(mockTodoService).getTodoHandler(
        listTodoRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        code: 404,
        resultMessage: "ENTITY_NOT_FOUND",
      });
    });
  });

  describe("newTodoHandler", () => {
    it("should create a new todo successfully", async () => {
      // Arrange
      const newTodoRequest: NewTodoRequest = {
        owner: mockUserRoleUser._id.toString(),
        todo: {
          title: "New Todo",
          description: "Test Description",
          completed: false,
          owner: mockUserRoleUser._id.toString(),
        },
      };
      mockRequest.body = newTodoRequest;

      const newTodo = {
        _id: "newtodoid",
        ...newTodoRequest.todo,
        owner: mockUserRoleUser._id.toString(),
      };

      (mockTodoService.createTodo as jest.Mock).mockResolvedValue({
        httpStatusCode: 201,
        message: "TODO_CREATED",
        todo: newTodo,
      });

      // Act
      await todoController(mockTodoService).newTodoHandler(
        newTodoRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockTodoService.createTodo).toHaveBeenCalledWith(newTodoRequest);
      expect(mockStatus).toHaveBeenCalledWith(201);
      expect(mockJson).toHaveBeenCalledWith({
        code: 201,
        resultMessage: "TODO_CREATED",
        todo: newTodo,
      });
    });

    it("should handle errors when creating todo", async () => {
      // Arrange
      const newTodoRequest: NewTodoRequest = {
        owner: mockUserRoleUser._id.toString(),
        todo: {
          title: "",
          description: "",
          completed: false,
          owner: mockUserRoleUser._id.toString(),
        },
      };
      mockRequest.body = newTodoRequest;

      (mockTodoService.createTodo as jest.Mock).mockResolvedValue({
        httpStatusCode: 400,
        message: "MISSING_FIELDS",
      });

      // Act
      await todoController(mockTodoService).newTodoHandler(
        newTodoRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(400);
      expect(mockJson).toHaveBeenCalledWith({
        code: 400,
        resultMessage: "MISSING_FIELDS",
      });
    });
  });

  describe("updateTodoHandler", () => {
    it("should update a todo successfully", async () => {
      // Arrange
      const updateTodoRequest: UpdateTodoRequest = {
        owner: mockUserRoleUser._id.toString(),
        todo: {
          _id: mockTodoRoleUser._id.toString(),
          title: "Updated Title",
          description: "Updated Description",
          completed: true,
        },
      };
      mockRequest.body = updateTodoRequest;

      const updatedTodo = {
        ...mockTodoRoleUser,
        ...updateTodoRequest.todo,
      };

      (mockTodoService.updateTodoByID as jest.Mock).mockResolvedValue({
        httpStatusCode: 200,
        message: "ENTITY_UPDATED",
        todo: updatedTodo,
      });

      // Act
      await todoController(mockTodoService).updateTodoHandler(
        updateTodoRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockTodoService.updateTodoByID).toHaveBeenCalledWith(
        updateTodoRequest
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        code: 200,
        resultMessage: "ENTITY_UPDATED",
        todo: updatedTodo,
      });
    });

    it("should handle errors when updating todo", async () => {
      // Arrange
      const updateTodoRequest: UpdateTodoRequest = {
        owner: mockUserRoleUser._id.toString(),
        todo: {
          _id: "nonexistentid",
          title: "Updated Title",
        },
      };
      mockRequest.body = updateTodoRequest;

      (mockTodoService.updateTodoByID as jest.Mock).mockResolvedValue({
        httpStatusCode: 404,
        message: "ENTITY_NOT_FOUND",
      });

      // Act
      await todoController(mockTodoService).updateTodoHandler(
        updateTodoRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        code: 404,
        resultMessage: "ENTITY_NOT_FOUND",
      });
    });
  });

  describe("deleteTodoHandler", () => {
    it("should delete a todo successfully", async () => {
      // Arrange
      const listTodoRequest: ListTodoByOwnerRequest = {
        owner: mockUserRoleUser._id.toString(),
        todoId: mockTodoRoleUser._id.toString(),
      };
      mockRequest.body = listTodoRequest;

      (mockTodoService.deleteTodoByID as jest.Mock).mockResolvedValue({
        httpStatusCode: 200,
        message: "ENTITY_DELETED",
      });

      // Act
      await todoController(mockTodoService).deleteTodoHandler(
        listTodoRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockTodoService.deleteTodoByID).toHaveBeenCalledWith(
        listTodoRequest
      );
      expect(mockStatus).toHaveBeenCalledWith(200);
      expect(mockJson).toHaveBeenCalledWith({
        code: 200,
        resultMessage: "ENTITY_DELETED",
      });
    });

    it("should handle errors when deleting todo", async () => {
      // Arrange
      const listTodoRequest: ListTodoByOwnerRequest = {
        owner: mockUserRoleUser._id.toString(),
        todoId: "nonexistentid",
      };
      mockRequest.body = listTodoRequest;

      (mockTodoService.deleteTodoByID as jest.Mock).mockResolvedValue({
        httpStatusCode: 404,
        message: "ENTITY_NOT_FOUND",
      });

      // Act
      await todoController(mockTodoService).deleteTodoHandler(
        listTodoRequest,
        mockResponse as Response
      );

      // Assert
      expect(mockStatus).toHaveBeenCalledWith(404);
      expect(mockJson).toHaveBeenCalledWith({
        code: 404,
        resultMessage: "ENTITY_NOT_FOUND",
      });
    });
  });
});
