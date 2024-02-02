const sinon = require("sinon");
const {newTodo, existingTodo, updateTodo} = require("../mocks/todo.mock");
const todoController = require("../../src/api/controllers/todoController");

describe("todoController Unit Tests", () => {
  describe("getTodos", () => {
    it("should return a list of todos", async () => {
      const req = {
        user: "5f0f6d4a4f2b9b3d8c9f2b4d",
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const listActiveTodos = sinon.stub();
      listActiveTodos.withArgs(req.user).resolves({
        httpStatusCode: 200,
        message: "Active Todos",
        todos: [existingTodo],
      });

      await todoController.getTodos(req, res);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledWith(res.json, {
        resultMessage: "Active Todos",
        activeTodos: [existingTodo],
      });
    });
  });

  describe("getTodo", () => {
    it("should return a todo", async () => {
      const req = {
        user: "5f0f6d4a4f2b9b3d8c9f2b4d",
        params: { id: "5f0f6d4a4f2b9b3d8c9f2b4d" },
      };
      const res = {
        status: sinon.spy(),
        json: sinon.spy(),
      };
      const listTodoByID = sinon.stub();
      listTodoByID.withArgs(req.user, req.params.id).resolves({
        httpStatusCode: 200,
        message: "Todo Found",
    });
});
});        
      }