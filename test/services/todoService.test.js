const expect = require("chai").expect;
const sinon = require("sinon");
const { newTodo, existingTodo, updateTodo } = require("../mocks/todo.mock");
const todoService = require("../../src/services/todoService");

describe("TodoService Unit Tests", () => {
  afterEach(function () {
    sinon.restore();
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
  });
});
