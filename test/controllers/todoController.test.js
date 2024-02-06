const sinon = require("sinon");
const { newTodo, existingTodo, updateTodo } = require("../mocks/todo.mock");
const todoController = require("../../src/api/controllers/todoController");

describe("todoController Unit Tests", () => {
  describe("getTodos method", () => {
    let req, res, json, sandbox, listActiveTodosStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should return a list of todos associated to an active user", async () => {
      req = {
        user: "5f0f6d4a4f2b9b3d8c9f2b4d",
      };

      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });

      listActiveTodosStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "Tasks found",
        todos: [existingTodo],
      });

      todoController.setActiveTodos(listActiveTodosStub);

      await todoController.getTodosHandler(req, res);
      sinon.assert.calledOnce(listActiveTodosStub);
      sinon.assert.calledWith(listActiveTodosStub, req.user);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "Tasks found",
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
});
