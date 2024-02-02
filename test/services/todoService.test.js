const expect = require("chai").expect;
const sinon = require("sinon");
const { newTodo, existingTodo, updateTodo } = require("../mocks/todo.mock");
const todoService = require("../../src/services/todoService");

describe("TodoService Unit Tests", () => {
  afterEach(function () {
    sinon.restore();
  });

  describe("listActiveTodos()", () => {
    it("should return a list of todos", async () => {
      const mockResponse = {
        httpStatusCode: 200,
        message: "Tasks found",
        todos: [existingTodo],
      };

      sinon.stub(todoService, "listActiveTodos").resolves(mockResponse);

      const response = await todoService.listActiveTodos();

      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("Tasks found");
      expect(response.todos).to.exist;
      expect(response.todos).to.be.an("array");
      expect(response.todos).to.have.lengthOf(1);
    });

    it("should return if no todos are found", async () => {
      const mockResponse = {
        httpStatusCode: 404,
        message: "No active tasks found for active user",
      };

      sinon.stub(todoService, "listActiveTodos").resolves(mockResponse);

      const response = await todoService.listActiveTodos();

      expect(response.httpStatusCode).to.equal(404);
      expect(response.message).to.equal(
        "No active tasks found for active user"
      );
    });
  });

  describe("listTodoByID()", () => {
    it("should return a todo with valid data", async () => {
      const requestUserId = existingTodo.user;
      const requestTodoId = existingTodo._id;

      const mockResponse = {
        httpStatusCode: 200,
        message: "Todo found",
        todo: existingTodo,
      };

      sinon.stub(todoService, "listTodoByID").resolves(mockResponse);

      const response = await todoService.listTodoByID(
        requestUserId,
        requestTodoId
      );

      expect(response.httpStatusCode).to.equal(200);
      expect(response.message).to.equal("Todo found");
      expect(response.todo).to.exist;
      expect(response.todo.title).to.equal(existingTodo.title);
      expect(response.todo.description).to.equal(existingTodo.description);
      expect(response.todo.user.toString()).to.equal(
        existingTodo.user.toString()
      );
      expect(response.todo.completed).to.equal(existingTodo.completed);
    });

    it("should return if the todo does not exist", async () => {
      const requestUserId = existingTodo.user;
      const requestTodoId = existingTodo._id;

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
      const requestUserId = existingTodo.user;
      const requestTodoId = existingTodo._id;

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
      const requestUserId = existingTodo.user;
      const requestTodoId = existingTodo._id;
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
      const requestUserId = existingTodo.user;
      const requestTodoId = existingTodo._id;
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
      const requestUserId = existingTodo.user;
      const requestTodoId = existingTodo._id;
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
      const requestUserId = existingTodo.user;
      const requestTodoId = existingTodo._id;

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
      const requestUserId = existingTodo.user;
      const requestTodoId = existingTodo._id;

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
      const requestUserId = existingTodo.user;
      const requestTodoId = existingTodo._id;

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
