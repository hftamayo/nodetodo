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
      expect(result.message).toBe("TASKS_FOUND");
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
      expect(result.message).toBe("TASKS_FOUND");
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
      expect(result.message).toBe("TASKS_NOT_FOUND");
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
      expect(result.message).toBe("ENTITY_FOUND");
      expect(result.data).toBeDefined();
      expect(result.todo!._id).toEqual(mockTodoRoleUser._id);
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
      expect(result.message).toBe("ENTITY_NOT_FOUND");
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
      expect(result.httpStatusCode).toBe(401);
      expect(result.message).toBe("FORBIDDEN");
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
        save: jest.fn().mockResolvedValue({
          ...savedTodo,
          toObject: () => savedTodo,
        }),
      };

      (mockTodoModel as unknown as jest.Mock).mockImplementation(
        () => mockTodoInstance
      );

      // Act
      const result = await todoService.createTodo(mockRequest);

      // Assert
      expect(result.httpStatusCode).toBe(200);
      expect(result.message).toBe("TODO_CREATED");
      expect(result.data).toBeDefined();

      if (result.todo) {
        result.todo = savedTodo;
        expect(result.todo.title).toBe(mockTodoRoleUser.title);
        expect(result.todo.description).toBe(mockTodoRoleUser.description);
        expect(result.todo.completed).toBe(mockTodoRoleUser.completed);
        expect(result.todo.owner).toBe(mockTodoRoleUser.owner);
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
      expect(result.message).toBe("MISSING_FIELDS");
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
      expect(result.httpStatusCode).toBe(400);
      expect(result.message).toBe("TITLE_ALREADY_TAKEN");
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
      expect(result.message).toBe("ENTITY_UPDATED");
      expect(result.data).toBeDefined();
      expect(result.todo!.title).toBe(mockRequest.todo.title);
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
      expect(result.message).toBe("MISSING_FIELDS");
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
      expect(result.message).toBe("ENTITY_NOT_FOUND");
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
      expect(result.httpStatusCode).toBe(401);
      expect(result.message).toBe("FORBIDDEN");
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
      expect(result.message).toBe("ENTITY_DELETED");
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
      expect(result.message).toBe("ENTITY_NOT_FOUND");
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
      expect(result.httpStatusCode).toBe(401);
      expect(result.message).toBe("FORBIDDEN");
    });
  });
});
