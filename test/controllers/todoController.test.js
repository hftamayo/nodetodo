const sinon = require("sinon");
const { newTodo, todoSupervisor, updateTodo } = require("../mocks/todo.mock");
const { mockUserSupervisor } = require("../mocks/user.mock");

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
      sinon.assert.calledOnce(listActiveTodosStub);
      sinon.assert.calledWith(listActiveTodosStub, req.user);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "Tasks found",
        activeTodos: todoSupervisor,
      });
    });
  });

  describe("getTodo method", () => {
    let req, res, json, sandbox, listActiveTodoStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should return a todo", async () => {
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

      sinon.assert.calledOnce(listActiveTodoStub);
      sinon.assert.calledWith(listActiveTodoStub, req.user);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "Todo found",
        searchTodo: todoSupervisor,
      });      

    });
  });
});
