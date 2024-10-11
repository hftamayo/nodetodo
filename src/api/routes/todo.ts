import express, { Request, Response } from "express";
import authorize from "../middleware/authorize";
import validator from "../middleware/validator";
import validateResult from "../middleware/validationResults";
import todoService from "../../services/todoService";
import todoController from "../controllers/todoController";
import {
  NewTodoRequest,
  OwnerTodoIdRequest,
  UpdateTodoRequest,
  TodoServices,
} from "../../types/todo.interface";
import { UserIdRequest } from "../../types/user.interface";

const todoRouter = express.Router();

const controller = todoController(todoService as TodoServices);

const getTodosHandler = (req: Request, res: Response) => {
  const userIdRequest: UserIdRequest = { userId: req.body.userId };
  controller.getTodosHandler(userIdRequest, res);
};

const getTodoHandler = (req: Request, res: Response) => {
  const ownerTodoIdRequest = req as unknown as OwnerTodoIdRequest;
  ownerTodoIdRequest.user = { userId: req.body.userId };
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
  updateTodoRequest.todo.id = req.params.id;

  controller.updateTodoHandler(updateTodoRequest, res);
};

const deleteTodoHandler = (req: Request, res: Response) => {
  const ownerTodoIdRequest = req as unknown as OwnerTodoIdRequest;
  ownerTodoIdRequest.user = { userId: req.body.userId };
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
