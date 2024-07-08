import {
  newStandardTodo,
  newTodoSupervisor,
  todoForUpdate,
  deleteTodo,
} from "../mocks/todo.mock";
import { mockUserInvalid, mockUserRoleUser } from "../mocks/user.mock";
import {
  NewTodoRequest,
  UpdateTodoRequest,
  OwnerTodoIdRequest,
  TodoResult,
} from "../../src/types/todo.interface";
import { UserIdRequest } from "../../src/types/user.interface";
import todoService from "../../src/services/todoService";

jest.mock('../path/to/todoService', () => ({
  listTodoByID: jest.fn().mockResolvedValue({
    httpStatusCode: 200,
    message: "Todo found",
    todo: {
      ...newTodoSupervisor,
      _id: newTodoSupervisor._id.toString(),
    },
  })
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

      const mockResponse = {
        httpStatusCode: 200,
        message: "Tasks found",
        todos: [newStandardTodo],
      };

      jest
        .spyOn(todoService, "listActiveTodos")
        .mockResolvedValue(mockResponse);

      const response = await todoService.listActiveTodos(userIdRequest);

      expect(response.httpStatusCode).toBe(200);
      expect(response.todos).toBeDefined();
      expect(response.message).toEqual("Tasks found");
      expect(response.todos).toBe("array");
      expect(response.todos).toHaveLength(1);
    });

    it("should return if no todos are found", async () => {
      const userId = mockUserInvalid.id;

      const userIdRequest: UserIdRequest = {
        userId: userId,
      };

      const mockResponse = {
        httpStatusCode: 404,
        message: "No active tasks found for active user",
      };

      jest
        .spyOn(todoService, "listActiveTodos")
        .mockResolvedValue(mockResponse);

      const response = await todoService.listActiveTodos(userIdRequest);

      expect(response.httpStatusCode).toBe(404);
      expect(response.message).toBe("No active tasks found for active user");
    });
  });

  describe("listTodoByID()", () => {
    it("should return a todo with valid data", async () => {
      const mockRequest = {
        user: { userId: newTodoSupervisor.user.toString()},
        params: {
          todoId: newTodoSupervisor._id.toString(),
        },
      } as OwnerTodoIdRequest;
  
      // Since todoService is mocked, this call will use the mock implementation
      const response = await todoService.listTodoByID(mockRequest);
  
      expect(response.httpStatusCode).toBe(200);
      expect(response.todo).toBeDefined();
      expect(response.message).toBe("Todo found");
      expect(response.todo!.title).toBe(newTodoSupervisor.title);
      expect(response.todo!.description).toBe(newTodoSupervisor.description);
      expect(response.todo!.user.toString()).toBe(newTodoSupervisor.user.toString());
      expect(response.todo!.completed).toBe(newTodoSupervisor.completed);
    });

      
    });

    it("should return if the todo does not exist", async () => {
      const requestUserId = todoSupervisor.user;
      const requestTodoId = todoSupervisor._id;

      const mockResponse = {
        httpStatusCode: 404,
        message: "Task Not Found",
      };

      sinon.stub(todoService, "listTodoByID").resolves(mockResponse);

      const response = await todoService.listTodoByID(
        requestUserId,
        requestTodoId
      );

      expect(response.httpStatusCode).to.equal(404);
      expect(response.message).to.equal("Task Not Found");
    });

    it("should return if the user is not the owner of the todo", async () => {
      const requestUserId = todoSupervisor.user;
      const requestTodoId = todoSupervisor._id;

      const mockResponse = {
        httpStatusCode: 400,
        message: "There's a problem with your credentials",
      };

      sinon.stub(todoService, "listTodoByID").resolves(mockResponse);

      const response = await todoService.listTodoByID(
        requestUserId,
        requestTodoId
      );

      expect(response.httpStatusCode).to.equal(400);
      expect(response.message).to.equal(
        "There's a problem with your credentials"
      );
    });
  });

  describe("createTodo()", () => {
    it("should create a new todo with valid data", async () => {
      const requestBody = newTodo();

      const mockResponse = {
        httpStatusCode: 200,
        message: "Todo created successfully",
        todo: requestBody,
      };

      sinon.stub(todoService, "createTodo").resolves(mockResponse);

      const response = await todoService.createTodo(requestBody);

      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("Todo created successfully");
      expect(response.todo).to.exist;
      expect(response.todo.title).to.equal(requestBody.title);
      expect(response.todo.description).to.equal(requestBody.description);
      expect(response.todo.user.toString()).to.equal(
        requestBody.user.toString()
      );
      expect(response.todo.completed).to.equal(requestBody.completed);
    });

    it("should return if the title already exists", async () => {
      const requestBody = newTodo();

      const mockResponse = {
        httpStatusCode: 400,
        message: "Title already taken",
      };

      sinon.stub(todoService, "createTodo").resolves(mockResponse);

      const response = await todoService.createTodo(requestBody);

      expect(response.httpStatusCode).to.equal(400);
      expect(response.message).to.equal("Title already taken");
    });
  });

  describe("updateTodoByID()", () => {
    it("should update a todo with valid data", async () => {
      const requestUserId = todoSupervisor.user;
      const requestTodoId = todoSupervisor._id;
      const requestBody = updateTodo;

      const mockResponse = {
        httpStatusCode: 200,
        message: "Todo updated successfully",
      };

      sinon.stub(todoService, "updateTodoByID").resolves(mockResponse);

      const response = await todoService.updateTodoByID(
        requestUserId,
        requestTodoId,
        requestBody
      );

      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("Todo updated successfully");
    });

    it("should return if the todo does not exist", async () => {
      const requestUserId = todoSupervisor.user;
      const requestTodoId = todoSupervisor._id;
      const requestBody = updateTodo;

      const mockResponse = {
        httpStatusCode: 404,
        message: "Todo Not Found",
      };

      sinon.stub(todoService, "updateTodoByID").resolves(mockResponse);

      const response = await todoService.updateTodoByID(
        requestUserId,
        requestTodoId,
        requestBody
      );

      expect(response.httpStatusCode).to.equal(404);
      expect(response.message).to.equal("Todo Not Found");
    });

    it("should return if the user is not the owner of the todo", async () => {
      const requestUserId = todoSupervisor.user;
      const requestTodoId = todoSupervisor._id;
      const requestBody = updateTodo;

      const mockResponse = {
        httpStatusCode: 401,
        message: "You're not the owner of this Todo",
      };

      sinon.stub(todoService, "updateTodoByID").resolves(mockResponse);

      const response = await todoService.updateTodoByID(
        requestUserId,
        requestTodoId,
        requestBody
      );

      expect(response.httpStatusCode).to.equal(401);
      expect(response.message).to.equal("You're not the owner of this Todo");
    });
  });

  describe("deleteTodoByID()", () => {
    it("should delete a todo with valid data", async () => {
      const requestUserId = todoSupervisor.user;
      const requestTodoId = todoSupervisor._id;

      const mockResponse = {
        httpStatusCode: 200,
        message: "Todo Deleted Successfully",
      };

      sinon.stub(todoService, "deleteTodoByID").resolves(mockResponse);

      const response = await todoService.deleteTodoByID(
        requestUserId,
        requestTodoId
      );

      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("Todo Deleted Successfully");
    });

    it("should return if the todo does not exist", async () => {
      const requestUserId = todoSupervisor.user;
      const requestTodoId = todoSupervisor._id;

      const mockResponse = {
        httpStatusCode: 404,
        message: "Todo Not Found",
      };

      sinon.stub(todoService, "deleteTodoByID").resolves(mockResponse);

      const response = await todoService.deleteTodoByID(
        requestUserId,
        requestTodoId
      );

      expect(response.httpStatusCode).to.equal(404);
      expect(response.message).to.equal("Todo Not Found");
    });

    it("should return if the user is not the owner of the todo", async () => {
      const requestUserId = todoSupervisor.user;
      const requestTodoId = todoSupervisor._id;

      const mockResponse = {
        httpStatusCode: 401,
        message: "You're not the owner of this Todo",
      };

      sinon.stub(todoService, "deleteTodoByID").resolves(mockResponse);

      const response = await todoService.deleteTodoByID(
        requestUserId,
        requestTodoId
      );

      expect(response.httpStatusCode).to.equal(401);
      expect(response.message).to.equal("You're not the owner of this Todo");
    });
  });
});
