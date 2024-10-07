import Todo from "../../src/models/Todo";
import { mockTodoRoleUser } from "../mocks/todo.mock";

describe("Todo Model", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should create a new todo with valid data", async () => {
    const saveMock = jest
      .spyOn(Todo.prototype, "save")
      .mockResolvedValue(mockTodoRoleUser);

    const todo = new Todo(mockTodoRoleUser);

    await todo.save();

    expect(todo).toBeDefined();
    expect(todo.title).toEqual(mockTodoRoleUser.title);
    expect(todo.description).toEqual(mockTodoRoleUser.description);
    expect(todo.completed).toEqual(mockTodoRoleUser.completed);
    expect(todo.user.toString()).toEqual(mockTodoRoleUser.user.toString());

    saveMock.mockRestore();
  });

  it("should throw an error if the todo's title is missing", async () => {
    const { title, ...todoWithoutTitle } = mockTodoRoleUser;
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
    const { description, ...todoWithoutDesc } = mockTodoRoleUser;
    const saveMock = jest
      .spyOn(Todo.prototype, "save")
      .mockRejectedValue(
        new Error("Todo validation failed: `description` is required")
      );

    const todo = new Todo(todoWithoutDesc);

    await expect(todo.save()).rejects.toThrow(
      "Todo validation failed: `description` is required"
    );

    saveMock.mockRestore();
  });

  it("should throw an error if the todo's completed status is missing", async () => {
    const { completed, ...todoWithoutStatus } = mockTodoRoleUser;
    const saveMock = jest
      .spyOn(Todo.prototype, "save")
      .mockRejectedValue(
        new Error("Todo validation failed: `status` is required")
      );

    const todo = new Todo(todoWithoutStatus);

    await expect(todo.save()).rejects.toThrow(
      "Todo validation failed: `status` is required"
    );

    saveMock.mockRestore();
  });
});
