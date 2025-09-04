import { mongo } from "mongoose";
import Todo from "@/models/Todo";
import { mockTodoRoleUser, mockTodoRoleSupervisor } from "../mocks/todo.mock";
import { mockUserRoleUser, mockUserRoleSupervisor } from "../mocks/user.mock";
import {
  ListTodosByOwnerRequest,
  ListTodoByOwnerRequest,
  NewTodoRequest,
  UpdateTodoRequest,
} from "@/types/todo.types";
import todoService from "@/services/todoService";

jest.mock("@/models/Todo");

// Mock console.error to suppress expected error messages during testing
const originalConsoleError = console.error;
beforeAll(() => {
  console.error = jest.fn();
});

afterAll(() => {
  console.error = originalConsoleError;
});

describe("TodoService Unit Tests", () => {
  const mockTodoModel = Todo as jest.Mocked<typeof Todo>;

  beforeEach(() => {
    jest.clearAllMocks();
  });

  describe("listTodos", () => {
    it("should return a list of todos with pagination", async () => {
      // Arrange
      const mockRequest: ListTodosByOwnerRequest = {
        owner: mockUserRoleUser._id.toString(),
        page: 1,
        limit: 10,
        activeOnly: false,
      };

      const mockTodoList = [mockTodoRoleUser, mockTodoRoleSupervisor];
      mockTodoModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue(mockTodoList),
      } as any);

      // Act
      const result = await todoService.listTodos(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(200);
      expect(result.message).toBe("Todos retrieved successfully");
      expect(result.data).toHaveLength(2);
      expect(mockTodoModel.find).toHaveBeenCalledWith({
        owner: mockRequest.owner,
      });
    });

    it("should filter active todos when activeOnly is true", async () => {
      // Arrange
      const mockRequest: ListTodosByOwnerRequest = {
        owner: mockUserRoleUser._id.toString(),
        page: 1,
        limit: 10,
        activeOnly: true,
      };

      mockTodoModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([mockTodoRoleUser]),
      } as any);

      // Act
      const result = await todoService.listTodos(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(200);
      expect(result.message).toBe("Todos retrieved successfully");
      expect(mockTodoModel.find).toHaveBeenCalledWith({
        owner: mockRequest.owner,
        completed: false,
      });
    });

    it("should return 404 when no todos are found", async () => {
      // Arrange
      const mockRequest: ListTodosByOwnerRequest = {
        owner: mockUserRoleUser._id.toString(),
        page: 1,
        limit: 10,
        activeOnly: false,
      };

      mockTodoModel.find.mockReturnValue({
        sort: jest.fn().mockReturnThis(),
        skip: jest.fn().mockReturnThis(),
        limit: jest.fn().mockReturnThis(),
        exec: jest.fn().mockResolvedValue([]),
      } as any);

      // Act
      const result = await todoService.listTodos(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(404);
      expect(result.message).toBe("No todos found");
    });
  });

  describe("listTodoByID", () => {
    it("should return a todo when found and owned by the user", async () => {
      // Arrange
      const mockRequest: ListTodoByOwnerRequest = {
        owner: mockTodoRoleUser.owner.toString(),
        todoId: mockTodoRoleUser._id.toString(),
      };

      mockTodoModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTodoRoleUser),
      } as any);

      // Act
      const result = await todoService.listTodoByID(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(200);
      expect(result.message).toBe("Todo retrieved successfully");
      expect(result.data).toBeDefined();
      expect(result.data!._id).toEqual(mockTodoRoleUser._id);
    });

    it("should return 404 when todo is not found", async () => {
      // Arrange
      const mockRequest: ListTodoByOwnerRequest = {
        owner: mockTodoRoleUser.owner.toString(),
        todoId: new mongo.ObjectId().toString(),
      };

      mockTodoModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      // Act
      const result = await todoService.listTodoByID(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(404);
      expect(result.message).toBe("Todo not found");
    });

    it("should return 401 when todo is not owned by the user", async () => {
      // Arrange
      const mockRequest: ListTodoByOwnerRequest = {
        owner: mockUserRoleSupervisor._id.toString(),
        todoId: mockTodoRoleUser._id.toString(),
      };

      mockTodoModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTodoRoleUser),
      } as any);

      // Act
      const result = await todoService.listTodoByID(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(403);
      expect(result.message).toBe("Unauthorized access to todo");
    });
  });

  describe("createTodo", () => {
    it("should create a new todo successfully", async () => {
      // Arrange
      const mockRequest: NewTodoRequest = {
        owner: mockTodoRoleUser.owner.toString(),
        todo: {
          title: mockTodoRoleUser.title,
          description: mockTodoRoleUser.description,
          owner: mockTodoRoleUser.owner.toString(),
        },
      };

      mockTodoModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      const savedTodo = {
        _id: mockTodoRoleUser._id,
        title: mockTodoRoleUser.title,
        description: mockTodoRoleUser.description,
        completed: mockTodoRoleUser.completed,
        owner: mockTodoRoleUser.owner,
      };

      const mockTodoInstance = {
        _id: savedTodo._id,
        title: savedTodo.title,
        description: savedTodo.description,
        completed: savedTodo.completed,
        owner: savedTodo.owner,
        save: jest.fn().mockResolvedValue({
          _id: savedTodo._id,
          title: savedTodo.title,
          description: savedTodo.description,
          completed: savedTodo.completed,
          owner: savedTodo.owner,
        }),
      };

      (mockTodoModel as unknown as jest.Mock).mockImplementation(
        () => mockTodoInstance
      );

      // Act
      const result = await todoService.createTodo(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(201);
      expect(result.message).toBe("Todo created successfully");
      expect(result.data).toBeDefined();

      if (result.data) {
        expect(result.data.title).toBe(mockTodoRoleUser.title);
        expect(result.data.description).toBe(mockTodoRoleUser.description);
        expect(result.data.completed).toBe(mockTodoRoleUser.completed);
        expect(result.data.owner).toBe(mockTodoRoleUser.owner);
      }
    });

    it("should return 400 when required fields are missing", async () => {
      // Arrange
      const mockRequest: NewTodoRequest = {
        owner: mockUserRoleUser._id.toString(),
        todo: {
          title: "",
          description: "",
          owner: mockUserRoleUser._id.toString(),
        },
      };

      // Act
      const result = await todoService.createTodo(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(400);
      expect(result.message).toBe("Missing required fields");
    });

    it("should return 400 when title is already taken", async () => {
      // Arrange
      const mockRequest: NewTodoRequest = {
        owner: mockUserRoleUser._id.toString(),
        todo: {
          title: mockTodoRoleUser.title,
          description: "Test Description",
          owner: mockUserRoleUser._id.toString(),
        },
      };

      mockTodoModel.findOne.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTodoRoleUser),
      } as any);

      // Act
      const result = await todoService.createTodo(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(409);
      expect(result.message).toBe("Todo with this title already exists");
    });
  });

  describe("updateTodoByID", () => {
    it("should update a todo successfully", async () => {
      // Arrange
      const mockRequest: UpdateTodoRequest = {
        owner: mockTodoRoleUser.owner.toString(),
        todo: {
          _id: mockTodoRoleUser._id.toString(),
          title: "Updated Title",
          description: "Updated Description",
          completed: true,
        },
      };

      mockTodoModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockTodoRoleUser,
          save: jest.fn().mockResolvedValue({
            ...mockTodoRoleUser,
            ...mockRequest.todo,
          }),
        }),
      } as any);

      // Act
      const result = await todoService.updateTodoByID(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(200);
      expect(result.message).toBe("Todo updated successfully");
      expect(result.data).toBeDefined();
      expect(result.data!.title).toBe(mockRequest.todo.title);
    });

    it("should return 400 when required fields are missing", async () => {
      // Arrange
      const mockRequest: UpdateTodoRequest = {
        owner: mockTodoRoleUser.owner.toString(),
        todo: {
          _id: mockTodoRoleUser._id.toString(),
        },
      };

      // Act
      const result = await todoService.updateTodoByID(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(400);
      expect(result.message).toBe("Missing required fields or no updates provided");
    });

    it("should return 404 when todo is not found", async () => {
      // Arrange
      const mockRequest: UpdateTodoRequest = {
        owner: mockTodoRoleUser.owner.toString(),
        todo: {
          _id: new mongo.ObjectId().toString(),
          title: "Updated Title",
          description: "Updated Description",
        },
      };

      mockTodoModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      // Act
      const result = await todoService.updateTodoByID(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(404);
      expect(result.message).toBe("Todo not found");
    });

    it("should return 401 when todo is not owned by the user", async () => {
      // Arrange
      const mockRequest: UpdateTodoRequest = {
        owner: mockUserRoleSupervisor._id.toString(),
        todo: {
          _id: mockTodoRoleUser._id.toString(),
          title: "Updated Title",
          description: "Updated Description",
        },
      };

      mockTodoModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTodoRoleUser),
      } as any);

      // Act
      const result = await todoService.updateTodoByID(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(403);
      expect(result.message).toBe("Unauthorized access to todo");
    });
  });

  describe("deleteTodoByID", () => {
    it("should delete a todo successfully", async () => {
      // Arrange
      const mockRequest: ListTodoByOwnerRequest = {
        owner: mockTodoRoleUser.owner.toString(),
        todoId: mockTodoRoleUser._id.toString(),
      };

      mockTodoModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue({
          ...mockTodoRoleUser,
          deleteOne: jest.fn().mockResolvedValue(undefined),
        }),
      } as any);

      // Act
      const result = await todoService.deleteTodoByID(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(200);
      expect(result.message).toBe("Todo deleted successfully");
    });

    it("should return 404 when todo is not found", async () => {
      // Arrange
      const mockRequest: ListTodoByOwnerRequest = {
        owner: mockTodoRoleUser.owner.toString(),
        todoId: new mongo.ObjectId().toString(),
      };

      mockTodoModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(null),
      } as any);

      // Act
      const result = await todoService.deleteTodoByID(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(404);
      expect(result.message).toBe("Todo not found");
    });

    it("should return 401 when todo is not owned by the user", async () => {
      // Arrange
      const mockRequest: ListTodoByOwnerRequest = {
        owner: mockUserRoleSupervisor._id.toString(),
        todoId: mockTodoRoleUser._id.toString(),
      };

      mockTodoModel.findById.mockReturnValue({
        exec: jest.fn().mockResolvedValue(mockTodoRoleUser),
      } as any);

      // Act
      const result = await todoService.deleteTodoByID(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(403);
      expect(result.message).toBe("Unauthorized access to todo");
    });
  });
});
