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

const router = express.Router();

todoController.setActiveTodos(
  todoService.listActiveTodos as (
    newActiveTodos: UserIdRequest
  ) => Promise<TodoResult>
);

todoController.setTodoByID(
  todoService.listTodoByID as (
    params: UserIdRequest,
    todoIdRequest: TodoIdRequest
  ) => Promise<TodoResult>
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
  async (
    params: UserIdRequest,
    requestTodoId: TodoIdRequest,
    requestBody: Partial<TodoRequest>
  ): Promise<TodoResult> => {
    const result = await todoService.updateTodoByID(
      params,
      requestTodoId,
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

todoController.setDeleteTodoByID(
  (userId: UserIdRequest, todoId: TodoIdRequest): Promise<TodoResult> => {
    return todoService.deleteTodoByID(userId, todoId);
  }
);

const getTodosHandler = (req: Request, res: Response) => {
  const UserIdRequest: UserIdRequest = { userId: req.body.userId };
  todoController.getTodosHandler(UserIdRequest, res);
};

const getTodoHandler = (req: Request, res: Response) => {
  const user: UserIdRequest = { userId: req.body.userId };
  const id: TodoIdRequest = { todoId: req.params.id };

  const OwnerTodoIdRequest = req as unknown as OwnerTodoIdRequest;
  OwnerTodoIdRequest.user = user;
  OwnerTodoIdRequest.params.id = id;

  todoController.getTodoHandler(OwnerTodoIdRequest, res);
};

const newTodoHandler = (req: Request, res: Response) => {
  const OwnerTodoBodyRequest: OwnerTodoBodyRequest = req.body;
  todoController.newTodoHandler(OwnerTodoBodyRequest, res);
};

const updateTodoHandler = (req: Request, res: Response) => {
  const OwnerTodoBodyRequest: OwnerTodoBodyRequest = req.body;
  todoController.updateTodoHandler(OwnerTodoBodyRequest, res);
};

const deleteTodoHandler = (req: Request, res: Response) => {
  const user: UserIdRequest = { userId: req.body.userId };
  const id: TodoIdRequest = { todoId: req.params.id };

  const OwnerTodoIdRequest = req as unknown as OwnerTodoIdRequest;

  OwnerTodoIdRequest.user = user;
  OwnerTodoIdRequest.params.id = id;

  todoController.deleteTodoHandler(OwnerTodoIdRequest, res);
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
