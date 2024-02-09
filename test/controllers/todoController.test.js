const sinon = require("sinon");
const { newTodo, todoSupervisor, updateTodo, deleteTodo } = require("../mocks/todo.mock");
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

  describe("createTodo method", () => {
    let req, res, json, sandbox, newTodoStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should create a new todo", async () => {
      req = {
        user: mockUserSupervisor.id,
        body: newTodo,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });

      newTodoStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "Todo created successfully",
        todo: newTodo,
      });

      todoController.setCreateTodo(newTodoStub);

      await todoController.newTodoHandler(req, res);

      sinon.assert.calledOnce(newTodoStub);
      sinon.assert.calledWith(newTodoStub, req.user, req.body);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "Todo created successfully",
        newTodo: newTodo,
      });
    });
  });

  describe("updateTodo method", () => {
    let req, res, json, sandbox, updateTodoStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should update a todo", async () => {
      req = {
        user: mockUserSupervisor.id,
        params: { id: todoSupervisor._id },
        body: updateTodo,
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });

      updateTodoStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "Todo updated successfully",
        updateTodo: updateTodo,
      });

      todoController.setUpdateTodoByID(updateTodoStub);

      await todoController.updateTodoHandler(req, res);

      sinon.assert.calledOnce(updateTodoStub);
      sinon.assert.calledWith(updateTodoStub, req.user, req.params.id, req.body);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "Todo updated successfully",
        updateTodo: updateTodo,
      });
    });
  });

  describe("deleteTodo method", () => {
    let req, res, json, sandbox, deleteTodoStub;

    beforeEach(() => {
      sandbox = sinon.createSandbox();
    });

    afterEach(() => {
      sandbox.restore();
    });

    it("should delete a todo", async () => {
      req = {
        user: mockUserSupervisor.id,
        params: { id: todoSupervisor._id },
      };
      res = {};
      json = sandbox.spy();
      res.status = sandbox.stub().returns({ json });

      deleteTodoStub = sandbox.stub().resolves({
        httpStatusCode: 200,
        message: "Todo Deleted Successfully",
      });

      todoController.setDeleteTodoByID(deleteTodoStub);

      await todoController.deleteTodoHandler(req, res);

      sinon.assert.calledOnce(deleteTodoStub);
      sinon.assert.calledWith(deleteTodoStub, req.user, req.params.id);
      sinon.assert.calledOnce(res.status);
      sinon.assert.calledWith(res.status, 200);
      sinon.assert.calledOnce(json);
      sinon.assert.calledWith(json, {
        resultMessage: "Todo Deleted Successfully",
      });
    });
  });
});
