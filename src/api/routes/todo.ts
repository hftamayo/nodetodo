import express, { Request, Response } from "express";
import authorize from "../middleware/authorize";
import validator from "../middleware/validator";
import validateResult from "../middleware/validationResults";
import todoService from "../../services/todoService";
import todoController from "../controllers/todoController";
import {
  TodoRequest,
  TodoIdRequest,
  OwnerTodoIdRequest,
  OwnerTodoBodyRequest,
  TodoResult,
} from "../../types/todo.interface";
import { UserIdRequest } from "../../types/user.interface";
import { request } from "http";

const router = express.Router();

todoController.setActiveTodos(
  todoService.listActiveTodos as (
    newActiveTodos: UserIdRequest
  ) => Promise<TodoResult>
);

todoController.setTodoByID(
  (
    params: UserIdRequest,
    todoIdRequest: TodoIdRequest
  ): Promise<TodoResult> => {
    return todoService.listTodoByID(params, todoIdRequest);
  }
);

todoController.setCreateTodo(
  async (
    params: UserIdRequest,
    requestBody: Partial<TodoRequest>
  ): Promise<TodoResult> => {
    const result = await todoService.createTodo(
      params,
      requestBody as TodoRequest
    );
    return {
      httpStatusCode: result.httpStatusCode,
      message: result.message,
      todo: {
        id: result.todo?._id.toString(),
        title: result.todo?.title,
        description: result.todo?.description,
        completed: result.todo?.completed,
        user: result.todo?.user.toString(),
      },
    };
  }
);

todoController.setUpdateTodoByID(
  todoService.updateTodoByID as (
    params: OwnerTodoBodyRequest
  ) => Promise<TodoResult>
);
todoController.setDeleteTodoByID(
  (userId: UserIdRequest, todoId: TodoIdRequest): Promise<TodoResult> => {
    return todoService.deleteTodoByID(userId, todoId);
  }
);

const getTodosHandler = (req: Request, res: Response) => {
  todoController.getTodosHandler(req, res);
};

const getTodoHandler = (req: Request, res: Response) => {
  todoController.getTodoHandler(req, res);
};

const newTodoHandler = (req: Request, res: Response) => {
  todoController.newTodoHandler(req, res);
};

const updateTodoHandler = (req: Request, res: Response) => {
  todoController.updateTodoHandler(req, res);
};

const deleteTodoHandler = (req: Request, res: Response) => {
  todoController.deleteTodoHandler(req, res);
};

router.get("/list", authorize, getTodosHandler);
router.get("/task/:id", authorize, getTodoHandler);
router.post(
  "/create",
  authorize,
  validator.createTodoRules,
  validateResult,
  newTodoHandler
);
router.put(
  "/update/:id",
  authorize,
  validator.updateTodoRules,
  validateResult,
  updateTodoHandler
);
router.delete("/delete/:id", authorize, deleteTodoHandler);

export default router;
