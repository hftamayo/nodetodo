const expect = require("chai").expect;
const sinon = require("sinon");
const Todo = require("../../src/models/Todo");
const { newTodo, existingTodo } = require("../mocks/todo.mock");

describe("Todo Model", () => {
  it("should create a new todo with valid data", async () => {
    const saveStub = sinon.stub(Todo.prototype, "save");

    const mockTodo = newTodo();

    saveStub.resolves(mockTodo);

    const todo = new Todo(mockTodo);

    await todo.save();

    expect(todo).to.exist;
    expect(todo.title).to.equal(mockTodo.title);
    expect(todo.description).to.equal(mockTodo.description);
    expect(todo.completed).to.equal(mockTodo.completed);
    expect(todo.user.toString()).to.equal(mockTodo.user.toString());

    saveStub.restore();
  });

  it("should throw an error if the todo's title is missing", async () => {
    const todo = new Todo({
      title: "",
      description: existingTodo.description,
      completed: existingTodo.completed,
      user: existingTodo.user,
    });

    const saveStub = sinon.stub(Todo.prototype, "save");

    saveStub.rejects(new Error("Todo validation failed: `title` is required"));

    try {
      await todo.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.equal(
        "Todo validation failed: `title` is required"
      );
    }
    saveStub.restore();
  });

  it("should throw an error if the todo's description is missing", async () => {
    const todo = new Todo({
      title: existingTodo.title,
      description: "",
      completed: existingTodo.completed,
      user: existingTodo.user,
    });

    const saveStub = sinon.stub(Todo.prototype, "save");

    saveStub.rejects(
      new Error("Todo validation failed: `description` is required")
    );

    try {
      await todo.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.equal(
        "Todo validation failed: `description` is required"
      );
    }
    saveStub.restore();
  });

  it("should throw an error if the todo's completed status is missing", async () => {
    const todo = new Todo({
      title: existingTodo.title,
      description: existingTodo.description,
      completed: "",
      user: existingTodo.user,
    });

    const saveStub = sinon.stub(Todo.prototype, "save");

    saveStub.rejects(
      new Error("Todo validation failed: `completed` is required")
    );

    try {
      await todo.save();
    } catch (error) {
      expect(error).to.exist;
      expect(error.message).to.equal(
        "Todo validation failed: `completed` is required"
      );
    }
    saveStub.restore();
  });
});
