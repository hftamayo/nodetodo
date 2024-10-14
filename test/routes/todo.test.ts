import request from "supertest";
import express from "express";
import todoRouter from "../../src/api/routes/todo";
import todoController from "../../src/api/controllers/todoController";
import todoService from "../../src/services/todoService";
import { TodoServices } from "../../src/types/todo.interface";

jest.mock("../../src/controllers/todoController");
jest.mock("../../src/services/todoService");

const app = express();
app.use(express.json());
app.use("/todo", todoRouter);

describe("Todo Router", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should call getTodosHandler on GET /todo/list", async () => {
    const mockGetTodosHandler = todoController(todoService as TodoServices)
      .getTodosHandler as jest.Mock;
    mockGetTodosHandler.mockImplementation((req, res) =>
      res.status(200).json({ todos: [] })
    );

    const response = await request(app).get("/todo/list").send();

    expect(response.status).toBe(200);
    expect(response.body.todos).toEqual([]);
    expect(mockGetTodosHandler).toHaveBeenCalledTimes(1);
  });

  it("should call getTodoHandler on GET /todo/task/:id", async () => {
    const mockGetTodoHandler = todoController(todoService as TodoServices)
      .getTodoHandler as jest.Mock;
    mockGetTodoHandler.mockImplementation((req, res) =>
      res.status(200).json({ todo: { id: "todo-id" } })
    );

    const response = await request(app).get("/todo/task/todo-id").send();

    expect(response.status).toBe(200);
    expect(response.body.todo).toEqual({ id: "todo-id" });
    expect(mockGetTodoHandler).toHaveBeenCalledTimes(1);
  });

  it("should call newTodoHandler on POST /todo/create", async () => {
    const mockNewTodoHandler = todoController(todoService as TodoServices)
      .newTodoHandler as jest.Mock;
    mockNewTodoHandler.mockImplementation((req, res) =>
      res.status(201).json({ message: "Todo created" })
    );

    const response = await request(app).post("/todo/create").send({
      title: "New Todo",
      description: "Todo description",
    });

    expect(response.status).toBe(201);
    expect(response.body.message).toBe("Todo created");
    expect(mockNewTodoHandler).toHaveBeenCalledTimes(1);
  });

  it("should call updateTodoHandler on PATCH /todo/update/:id", async () => {
    const mockUpdateTodoHandler = todoController(todoService as TodoServices)
      .updateTodoHandler as jest.Mock;
    mockUpdateTodoHandler.mockImplementation((req, res) =>
      res.status(200).json({ message: "Todo updated" })
    );

    const response = await request(app).patch("/todo/update/todo-id").send({
      title: "Updated Todo",
      description: "Updated description",
    });

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Todo updated");
    expect(mockUpdateTodoHandler).toHaveBeenCalledTimes(1);
  });

  it("should call deleteTodoHandler on DELETE /todo/delete/:id", async () => {
    const mockDeleteTodoHandler = todoController(todoService as TodoServices)
      .deleteTodoHandler as jest.Mock;
    mockDeleteTodoHandler.mockImplementation((req, res) =>
      res.status(200).json({ message: "Todo deleted" })
    );

    const response = await request(app).delete("/todo/delete/todo-id").send();

    expect(response.status).toBe(200);
    expect(response.body.message).toBe("Todo deleted");
    expect(mockDeleteTodoHandler).toHaveBeenCalledTimes(1);
  });
});
