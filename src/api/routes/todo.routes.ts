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
import { UserIdRequest } from "../../types/user.types";

const todoRouter = express.Router();

const controller = todoController(todoService as TodoServices);

const getTodosHandler = (req: Request, res: Response) => {
  const owner: UserIdRequest = { userId: req.body.userId };
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

const getTodoHandler = (req: Request, res: Response) => {
  const ownerTodoIdRequest = req as unknown as ListTodoByOwnerRequest;
  ownerTodoIdRequest.owner = { userId: req.body.userId };
  ownerTodoIdRequest.params = { todoId: req.params.id };
  controller.getTodoHandler(ownerTodoIdRequest, res);
};

const newTodoHandler = (req: Request, res: Response) => {
  const NewTodoRequest = req.body as NewTodoRequest;
  NewTodoRequest.owner = { userId: req.body.userId };
  NewTodoRequest.todo = req.body;

  controller.newTodoHandler(NewTodoRequest, res);
};

const updateTodoHandler = (req: Request, res: Response) => {
  const updateTodoRequest = req.body as UpdateTodoRequest;
  updateTodoRequest.owner = { userId: req.body.userId };
  updateTodoRequest.todo = req.body.todo;
  updateTodoRequest.todo._id = req.params.id;

  controller.updateTodoHandler(updateTodoRequest, res);
};

const deleteTodoHandler = (req: Request, res: Response) => {
  const ownerTodoIdRequest = req as unknown as ListTodoByOwnerRequest;
  ownerTodoIdRequest.owner = { userId: req.body.userId };
  ownerTodoIdRequest.params = { todoId: req.params.id };
  controller.deleteTodoHandler(ownerTodoIdRequest, res);
};

todoRouter.get("/list", authorize, getTodosHandler);
todoRouter.get("/task/:id", authorize, getTodoHandler);
todoRouter.post(
  "/create",
  authorize,
  validator.createTodoRules,
  validateResult,
  newTodoHandler
);
todoRouter.patch(
  "/update/:id",
  authorize,
  validator.updateTodoRules,
  validateResult,
  updateTodoHandler
);
todoRouter.delete("/delete/:id", authorize, deleteTodoHandler);

export default todoRouter;
