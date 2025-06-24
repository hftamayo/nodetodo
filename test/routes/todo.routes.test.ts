import request from "supertest";
import express from "express";

// Mock middleware
jest.mock(
  "@middleware/authorize",
  () => () => (req: any, res: any, next: any) => {
    req.user = { sub: "test-user-id" };
    next();
  }
);
jest.mock("@middleware/validator", () => ({
  createTodoRules: [(req: any, res: any, next: any) => next()],
  updateTodoRules: [(req: any, res: any, next: any) => next()],
}));
jest.mock(
  "@middleware/validationResults",
  () => (req: any, res: any, next: any) => next()
);

// Mock todoService
jest.mock("@services/todoService", () => ({
  listTodos: jest.fn(),
  listTodoByID: jest.fn(),
  createTodo: jest.fn(),
  updateTodoByID: jest.fn(),
  deleteTodoByID: jest.fn(),
}));

// Mock controller factory and its methods
const mockGetTodosHandler = jest.fn((req: any, res: any) =>
  res.status(200).json({ message: "getTodosHandler called" })
);
const mockGetTodoHandler = jest.fn((req: any, res: any) =>
  res.status(200).json({ message: "getTodoHandler called" })
);
const mockNewTodoHandler = jest.fn((req: any, res: any) =>
  res.status(201).json({ message: "newTodoHandler called" })
);
const mockUpdateTodoHandler = jest.fn((req: any, res: any) =>
  res.status(200).json({ message: "updateTodoHandler called" })
);
const mockDeleteTodoHandler = jest.fn((req: any, res: any) =>
  res.status(200).json({ message: "deleteTodoHandler called" })
);

jest.mock("@controllers/todoController", () => () => ({
  getTodosHandler: mockGetTodosHandler,
  getTodoHandler: mockGetTodoHandler,
  newTodoHandler: mockNewTodoHandler,
  updateTodoHandler: mockUpdateTodoHandler,
  deleteTodoHandler: mockDeleteTodoHandler,
}));

import todoRouter from "@/api/routes/todo.routes";

const app = express();
app.use(express.json());
app.use("/todos", todoRouter);

afterEach(() => {
  jest.clearAllMocks();
});

describe("Todo Router", () => {
  it("DEBUG: should see what error we're getting", async () => {
    const response = await request(app).get("/todos/list");
    console.log("Status:", response.status);
    console.log("Body:", response.body);
    console.log("Headers:", response.headers);
  });

  it("should call getTodosHandler on GET /todos/list", async () => {
    const response = await request(app).get("/todos/list");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("getTodosHandler called");
    expect(mockGetTodosHandler).toHaveBeenCalledTimes(1);
  });

  it("should call getTodoHandler on GET /todos/task/:id", async () => {
    const response = await request(app).get("/todos/task/123");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("getTodoHandler called");
    expect(mockGetTodoHandler).toHaveBeenCalledTimes(1);
  });

  it("should call newTodoHandler on POST /todos/create", async () => {
    const response = await request(app)
      .post("/todos/create")
      .send({ title: "test todo", description: "desc" });
    expect(response.status).toBe(201);
    expect(response.body.message).toBe("newTodoHandler called");
    expect(mockNewTodoHandler).toHaveBeenCalledTimes(1);
  });

  it("should call updateTodoHandler on PATCH /todos/update/:id", async () => {
    const response = await request(app)
      .patch("/todos/update/123")
      .send({ title: "updated", description: "updated desc", completed: true });
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("updateTodoHandler called");
    expect(mockUpdateTodoHandler).toHaveBeenCalledTimes(1);
  });

  it("should call deleteTodoHandler on DELETE /todos/delete/:id", async () => {
    const response = await request(app).delete("/todos/delete/123");
    expect(response.status).toBe(200);
    expect(response.body.message).toBe("deleteTodoHandler called");
    expect(mockDeleteTodoHandler).toHaveBeenCalledTimes(1);
  });
});
