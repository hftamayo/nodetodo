import {
  mockTodoRoleUser,
  mockTodoRoleSupervisor,
  mockTodoForUpdate,
  mockDeleteTodo,
  mockInvalidTodo,
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
} from "../../src/types/todo.interface";
import { UserIdRequest } from "../../src/types/user.interface";
import todoService from "../../src/services/todoService";

jest.mock("../../src/services/todoService", () => ({
  listActiveTodos: jest.fn((userIdRequest) => {
    if (userIdRequest.userId === mockUserInvalid.id) {
      return Promise.resolve({
        httpStatusCode: 404,
        message: "No active tasks found for active user",
        todos: [],
      });
    } else {
      return Promise.resolve({
        httpStatusCode: 200,
        message: "Tasks found",
        todos: [mockTodoRoleUser],
      });
    }
  }),

  listTodoByID: jest.fn((mockRequest) => {
    if (mockRequest.user.userId === mockTodoRoleSupervisor._id.toString()) {
      return Promise.resolve({
        httpStatusCode: 200,
        message: "Todo found",
        todo: {
          ...mockTodoRoleSupervisor,
          _id: mockTodoRoleSupervisor._id.toString(),
        },
      });
    } else if (mockRequest.params.todoId === mockInvalidTodo._id) {
      return Promise.resolve({
        httpStatusCode: 404,
        message: "Todo Not Found",
      });
    } else {
      return Promise.resolve({
        httpStatusCode: 404,
        message: "Invalid credentials",
      });
    }
  }),

  createTodo: jest.fn((requestBody: NewTodoRequest) => {
    if (requestBody.todo.title === mockTodoRoleUser.title) {
      return Promise.resolve({
        httpStatusCode: 400,
        message: "Title already taken",
      });
    } else {
      return Promise.resolve({
        httpStatusCode: 200,
        message: "Todo created successfully",
      });
    }
  }),

  updateTodoByID: jest.fn((requestBody: UpdateTodoRequest) => {
    if (requestBody.todo._id === mockTodoForUpdate._id.toString()) {
      return Promise.resolve({
        httpStatusCode: 200,
        message: "Todo updated successfully",
      });
    } else if (requestBody.todo._id === mockInvalidTodo._id) {
      return Promise.resolve({
        httpStatusCode: 404,
        message: "Todo Not Found",
      });
    } else {
      return Promise.resolve({
        httpStatusCode: 401,
        message: "You're not the owner of this Todo",
      });
    }
  }),

  deleteTodoByID: jest.fn((owner: OwnerTodoIdRequest) => {
    const requestUserId = owner.user.userId;
    const requestTodoId = owner.params.todoId;
    if (requestTodoId === mockDeleteTodo._id.toString()) {
      return Promise.resolve({
        httpStatusCode: 200,
        message: "Todo Deleted Successfully",
      });
    } else if (requestTodoId === mockInvalidTodo._id) {
      return Promise.resolve({
        httpStatusCode: 404,
        message: "Todo Not Found",
      });
    } else if (requestUserId === mockUserInvalid.id) {
      return Promise.resolve({
        httpStatusCode: 401,
        message: "You're not the owner of this Todo",
      });
    }
  }),
}));

describe("TodoService Unit Tests", () => {
  afterEach(function () {
    jest.restoreAllMocks();
  });

  describe("listActiveTodos()", () => {
    it("should return a list of todos", async () => {
      const userId = mockUserRoleUser._id.toString();

      const userIdRequest: UserIdRequest = {
        userId: userId,
      };

      const response = await todoService.listActiveTodos(userIdRequest);

      expect(response.httpStatusCode).toBe(200);
      expect(response.todos).toBeDefined();
      expect(response.message).toEqual("Tasks found");
      expect(Array.isArray(response.todos)).toBe(true);
      expect(response.todos).toHaveLength(1);
    });

    it("should return if no todos are found", async () => {
      const userId = mockUserInvalid.id;

      const userIdRequest: UserIdRequest = {
        userId: userId,
      };

      const response = await todoService.listActiveTodos(userIdRequest);

      expect(response.httpStatusCode).toBe(404);
      expect(response.message).toBe("No active tasks found for active user");
    });
  });

  describe("listTodoByID()", () => {
    it("should return a todo with valid data", async () => {
      const mockRequest = {
        user: { userId: mockTodoRoleSupervisor.user.toString() },
        params: {
          todoId: mockTodoRoleSupervisor._id.toString(),
        },
      } as OwnerTodoIdRequest;

      const mockResponse = {
        httpStatusCode: 200,
        message: "Todo found",
        todo: mockTodoRoleSupervisor,
      };

      (todoService.listTodoByID as jest.Mock).mockResolvedValue(mockResponse);

      const response = await todoService.listTodoByID(mockRequest);

      expect(response.httpStatusCode).toBe(200);
      expect(response.todo).toBeDefined();
      expect(response.message).toBe("Todo found");
      expect(response.todo!.title).toBe(mockTodoRoleSupervisor.title);
      expect(response.todo!.description).toBe(
        mockTodoRoleSupervisor.description
      );
      expect(response.todo!.user.toString()).toBe(
        mockTodoRoleSupervisor.user.toString()
      );
      expect(response.todo!.completed).toBe(mockTodoRoleSupervisor.completed);
    });

    it("should return error if todo does not exist", async () => {
      const mockRequest = {
        user: { userId: mockTodoRoleSupervisor.user.toString() },
        params: {
          todoId: mockInvalidTodo._id,
        },
      } as OwnerTodoIdRequest;

      const mockResponse = {
        httpStatusCode: 404,
        message: "Todo Not Found",
      };

      (todoService.listTodoByID as jest.Mock).mockResolvedValue(mockResponse);

      const response = await todoService.listTodoByID(mockRequest);

      expect(response.httpStatusCode).toBe(404);
      expect(response.message).toBe("Todo Not Found");
    });

    it("should return if the user is not the owner of the todo", async () => {
      const mockRequest = {
        user: { userId: mockUserInvalid.id },
        params: {
          todoId: mockTodoRoleSupervisor._id.toString(),
        },
      } as OwnerTodoIdRequest;

      const mockResponse = {
        httpStatusCode: 404,
        message: "Invalid credentials",
      };

      (todoService.listTodoByID as jest.Mock).mockResolvedValue(mockResponse);

      const response = await todoService.listTodoByID(mockRequest);

      expect(response.httpStatusCode).toBe(404);
      expect(response.message).toBe("Invalid credentials");
    });
  });

  describe("createTodo()", () => {
    it("should create a new todo with valid data", async () => {
      const owner = {
        userId: mockTodoRoleUser.user.toString(),
      };
      const todoDetails = {
        title: mockTodoRoleUser.title,
        description: mockTodoRoleUser.description,
        completed: mockTodoRoleUser.completed,
        user: mockTodoRoleUser.user.toString(),
      };

      const requestBody: NewTodoRequest = {
        owner,
        todo: todoDetails,
      };

      const response = await todoService.createTodo(requestBody);

      expect(response.httpStatusCode).toBe(200);
      expect(response.todo).toBeDefined();
      expect(response.message).toBe("Todo created successfully");
      expect(response.todo!.title).toBe(todoDetails.title);
      expect(response.todo!.description).toBe(todoDetails.description);
      expect(response.todo!.user.toString()).toBe(todoDetails.user);
      expect(response.todo!.completed).toBe(todoDetails.completed);
    });

    it("should return if the title already exists", async () => {
      const owner = {
        userId: mockTodoRoleUser.user.toString(),
      };
      const todoDetails = {
        title: "this tile already exists",
        description: mockTodoRoleUser.description,
        completed: mockTodoRoleUser.completed,
        user: mockTodoRoleUser.user.toString(),
      };

      const requestBody: NewTodoRequest = {
        owner,
        todo: todoDetails,
      };

      const response = await todoService.createTodo(requestBody);

      expect(response.httpStatusCode).toBe(400);
      expect(response.message).toBe("Title already taken");
    });
  });

  describe("updateTodoByID()", () => {
    it("should update a todo with valid data", async () => {
      const owner = {
        userId: mockTodoRoleUser.user.toString(),
      };
      const todoUpdateDetails = {
        id: mockTodoForUpdate._id.toString(),
        title: mockTodoForUpdate.title,
        description: mockTodoForUpdate.description,
        completed: mockTodoForUpdate.completed,
      };

      const requestBody: UpdateTodoRequest = {
        owner,
        todo: todoUpdateDetails,
      };

      const updateResponse = {
        httpStatusCode: 200,
        message: "Todo updated successfully",
      };

      (todoService.updateTodoByID as jest.Mock).mockResolvedValue(
        updateResponse
      );

      const response = await todoService.updateTodoByID(requestBody);

      expect(response.httpStatusCode).toBe(200);
      expect(response.message).toBe("Todo updated successfully");
    });

    it("should return error if the todo does not exist", async () => {
      const owner = {
        userId: mockTodoRoleUser.user.toString(),
      };
      const todoUpdateDetails = {
        id: mockInvalidTodo._id.toString(),
        title: mockInvalidTodo.title,
        description: mockInvalidTodo.description,
        completed: mockInvalidTodo.completed,
      };

      const requestBody: UpdateTodoRequest = {
        owner,
        todo: todoUpdateDetails,
      };

      const mockResponse = {
        httpStatusCode: 404,
        message: "Todo Not Found",
      };

      (todoService.updateTodoByID as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const response = await todoService.updateTodoByID(requestBody);

      expect(response.httpStatusCode).toBe(404);
      expect(response.message).toBe("Todo Not Found");
    });

    it("should return error if the user is not the owner of the todo", async () => {
      const owner = {
        userId: mockUserInvalid.id,
      };
      const todoUpdateDetails = {
        id: mockTodoForUpdate._id,
        title: mockTodoForUpdate.title,
        description: mockTodoForUpdate.description,
        completed: mockTodoForUpdate.completed,
      };

      const requestBody: UpdateTodoRequest = {
        owner,
        todo: todoUpdateDetails,
      };

      const mockResponse = {
        httpStatusCode: 401,
        message: "You're not the owner of this Todo",
      };

      (todoService.updateTodoByID as jest.Mock).mockResolvedValueOnce(
        mockResponse
      );

      const response = await todoService.updateTodoByID(requestBody);

      expect(response.httpStatusCode).toBe(401);
      expect(response.message).toBe("You're not the owner of this Todo");
    });
  });

  describe("deleteTodoByID()", () => {
    it("should delete a todo with valid data", async () => {
      const mockRequest = {
        user: { userId: mockUserRoleSupervisor._id.toString() },
        params: {
          todoId: mockDeleteTodo._id.toString(),
        },
      } as OwnerTodoIdRequest;

      const response = await todoService.deleteTodoByID(mockRequest);

      expect(response.httpStatusCode).toBe(200);
      expect(response.message).toBe("Todo Deleted Successfully");
    });

    it("should return if the todo does not exist", async () => {
      const mockRequest = {
        user: { userId: mockUserRoleSupervisor._id.toString() },
        params: {
          todoId: mockInvalidTodo._id,
        },
      } as OwnerTodoIdRequest;

      const response = await todoService.deleteTodoByID(mockRequest);

      expect(response.httpStatusCode).toBe(404);
      expect(response.message).toBe("Todo Not Found");
    });

    it("should return error if the user is not the owner of the todo", async () => {
      const mockRequest = {
        user: { userId: mockUserInvalid.id },
        params: {
          todoId: mockInvalidTodo._id,
        },
      } as OwnerTodoIdRequest;

      const mockResponse = {
        httpStatusCode: 401,
        message: "You're not the owner of this Todo",
      };

      (todoService.deleteTodoByID as jest.Mock).mockResolvedValue(mockResponse);

      const response = await todoService.deleteTodoByID(mockRequest);

      expect(response.httpStatusCode).toBe(401);
      expect(response.message).toBe("You're not the owner of this Todo");
    });
  });
});
