import express, { Request, Response } from "express";
import authorize from "../middleware/authorize";
import validator from "../middleware/validator";
import validateResult from "../middleware/validationResults";
import todoService from "../../services/todoService";
import todoController from "../controllers/todoController";
import {
  ListTodosByOwnerRequest,
  ListTodoByOwnerRequest,
  NewTodoRequest,
  UpdateTodoRequest,
  TodoServices,
} from "../../types/todo.types";
import { AuthenticatedUserRequest } from "../../types/user.types";
import { DOMAINS, PERMISSIONS } from "../../config/envvars";

const todoRouter = express.Router();

const controller = todoController(todoService as TodoServices);

const getTodosHandler = (req: AuthenticatedUserRequest, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
  }

  const owner = req.user.id;
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
  if (!req.user?.id) {
    return res.status(401).json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
  }

  const listTodoByOwnerRequest: ListTodoByOwnerRequest = {
    owner: req.user.id,
    todoId: req.params.id,
  };
  controller.getTodoHandler(listTodoByOwnerRequest, res);
};

const newTodoHandler = (req: AuthenticatedUserRequest, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
  }

  const NewTodoRequest: NewTodoRequest = {
    owner: req.user.id,
    todo: {
      title: req.body.title,
      description: req.body.description,
      owner: req.user.id,
    },
  };

  controller.newTodoHandler(NewTodoRequest, res);
};

const updateTodoHandler = (req: Request, res: Response) => {
  const updateTodoRequest = req.body as UpdateTodoRequest;
  updateTodoRequest.owner = { userId: req.body.userId };
  updateTodoRequest.todo = req.body.todo;
  updateTodoRequest.todo._id = req.params.id;

  controller.updateTodoHandler(updateTodoRequest, res);
};

const deleteTodoHandler = (req: AuthenticatedUserRequest, res: Response) => {
  if (!req.user?.id) {
    return res.status(401).json({ code: 401, resultMessage: "NOT_AUTHORIZED" });
  }

  const ownerTodoIdRequest: ListTodoByOwnerRequest = {
    owner: req.user.id,
    todoId: req.params.id,
  };
  controller.deleteTodoHandler(ownerTodoIdRequest, res);
};

todoRouter.get(
  "/list",
  authorize(DOMAINS.TODO, PERMISSIONS.READ),
  getTodosHandler
);
todoRouter.get(
  "/task/:id",
  authorize(DOMAINS.TODO, PERMISSIONS.READ),
  getTodoHandler
);
todoRouter.post(
  "/create",
  authorize(DOMAINS.TODO, PERMISSIONS.WRITE),
  validator.createTodoRules,
  validateResult,
  newTodoHandler
);
todoRouter.patch(
  "/update/:id",
  authorize(DOMAINS.TODO, PERMISSIONS.UPDATE),
  validator.updateTodoRules,
  validateResult,
  updateTodoHandler
);
todoRouter.delete(
  "/delete/:id",
  authorize(DOMAINS.TODO, PERMISSIONS.DELETE),
  deleteTodoHandler
);

export default todoRouter;
