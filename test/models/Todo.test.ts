import Todo from "../../src/models/Todo";
import { newStandardTodo, todoSupervisor } from "../mocks/todo.mock";

describe("Todo Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it("should create a new todo with valid data", async () => {
    const mockTodo = newStandardTodo();

    const saveMock = jest
      .spyOn(Todo.prototype, "save")
      .mockResolvedValue(mockTodo);

      const todoData = newStandardTodo();
      const todo = new Todo(todoData);

      await todo.save();

      expect(todo).toBeDefined();
      expect(todo.title).toEqual(todoData.title);
      expect(todo.description).toEqual(todoData.description);
      expect(todo.completed).toEqual(todoData.completed);
      expect(todo.user.toString()).toEqual(todoData.user.toString());

      saveMock.mockRestore();
  });


  it("should throw an error if the todo's title is missing", async () => {
    const todo = new Todo({
      title: "",
      description: todoSupervisor.description,
      completed: todoSupervisor.completed,
      user: todoSupervisor.user,
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
      title: todoSupervisor.title,
      description: "",
      completed: todoSupervisor.completed,
      user: todoSupervisor.user,
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
      title: todoSupervisor.title,
      description: todoSupervisor.description,
      completed: "",
      user: todoSupervisor.user,
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
