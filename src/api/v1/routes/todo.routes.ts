import express, { Response } from "express";
import authorize from "@/api/v1/middleware/authorize";
import validator from "@/api/v1/middleware/validator";
import validateResult from "@/api/v1/middleware/validationResults";
import { userLimiter } from "@/api/v1/middleware/ratelimit";
import todoService from "@services/todoService";
import todoController from "@/api/v1/controllers/todoController";
import {
  ListTodosByOwnerRequest,
  ListTodoByOwnerRequest,
  NewTodoRequest,
  UpdateTodoRequest,
  TodoServices,
} from "@/types/todo.types";
import { AuthenticatedUserRequest } from "@/types/user.types";
import { DOMAINS, PERMISSIONS } from "@config/envvars";

const todoRouter = express.Router();

const controller = todoController(todoService as TodoServices);

const getTodosHandler = (req: AuthenticatedUserRequest, res: Response) => {
  const owner = req.user!.sub;
  const page = parseInt(req.query.page as string) || 1;
  const limit = parseInt(req.query.limit as string) || 10;
  const activeOnly = req.query.activeOnly === "true";

  const listTodosByOwnerRequest: ListTodosByOwnerRequest = {
    owner,
    page,
    limit,
    activeOnly,
  };

  controller.getTodosHandler(listTodosByOwnerRequest, res);
};

const getTodoHandler = (req: AuthenticatedUserRequest, res: Response) => {
  const listTodoByOwnerRequest: ListTodoByOwnerRequest = {
    owner: req.user!.sub,
    todoId: req.params.id,
  };
  controller.getTodoHandler(listTodoByOwnerRequest, res);
};

const newTodoHandler = (req: AuthenticatedUserRequest, res: Response) => {
  const newTodoRequest: NewTodoRequest = {
    owner: req.user!.sub,
    todo: {
      title: req.body.title,
      description: req.body.description,
      owner: req.user!.sub,
    },
  };

  controller.newTodoHandler(newTodoRequest, res);
};

const updateTodoHandler = (req: AuthenticatedUserRequest, res: Response) => {
  const updateTodoRequest: UpdateTodoRequest = {
    owner: req.user!.sub,
    todo: {
      _id: req.params.id,
      title: req.body.title,
      description: req.body.description,
      completed: req.body.completed,
    },
  };

  controller.updateTodoHandler(updateTodoRequest, res);
};

const deleteTodoHandler = (req: AuthenticatedUserRequest, res: Response) => {
  const ownerTodoIdRequest: ListTodoByOwnerRequest = {
    owner: req.user!.sub,
    todoId: req.params.id,
  };
  controller.deleteTodoHandler(ownerTodoIdRequest, res);
};

todoRouter.get(
  "/list",
  userLimiter,
  authorize(DOMAINS.TODO, PERMISSIONS.READ),
  getTodosHandler
);
todoRouter.get(
  "/task/:id",
  userLimiter,
  authorize(DOMAINS.TODO, PERMISSIONS.READ),
  getTodoHandler
);
todoRouter.post(
  "/create",
  userLimiter,
  authorize(DOMAINS.TODO, PERMISSIONS.WRITE),
  validator.createTodoRules,
  validateResult,
  newTodoHandler
);
todoRouter.patch(
  "/update/:id",
  userLimiter,
  authorize(DOMAINS.TODO, PERMISSIONS.UPDATE),
  validator.updateTodoRules,
  validateResult,
  updateTodoHandler
);
todoRouter.delete(
  "/delete/:id",
  userLimiter,
  authorize(DOMAINS.TODO, PERMISSIONS.DELETE),
  deleteTodoHandler
);

export default todoRouter;
