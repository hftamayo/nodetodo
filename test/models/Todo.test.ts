import Todo from "../../src/models/Todo";
import { newStandardTodo, todoSupervisor } from "../mocks/todo.mock";

describe("Todo Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });
  
  it("should create a new todo with valid data", async () => {
    const saveMock = jest
      .spyOn(Todo.prototype, "save")
      .mockResolvedValue(newStandardTodo);

      const todo = new Todo(newStandardTodo);

      await todo.save();

      expect(todo).toBeDefined();
      expect(todo.title).toEqual(newStandardTodo.title);
      expect(todo.description).toEqual(newStandardTodo.description);
      expect(todo.completed).toEqual(newStandardTodo.completed);
      expect(todo.user.toString()).toEqual(newStandardTodo.user.toString());

      saveMock.mockRestore();
  });


  it("should throw an error if the todo's title is missing", async () => {
    const { title, ...todoWithoutTitle } = newStandardTodo;
    const saveMock = jest
      .spyOn(Todo.prototype, "save")
      .mockRejectedValue(
        new Error("Todo validation failed: `title` is required")
      );

    const todo = new Todo(todoWithoutTitle);

    await expect(todo.save()).rejects.toThrow(
      "Todo validation failed: `title` is required"
    );

    saveMock.mockRestore();
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
