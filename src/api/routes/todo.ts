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
  TodoServices,
} from "../../types/todo.interface";
import { UserIdRequest } from "../../types/user.interface";

const router = express.Router();

const controller = todoController(todoService as TodoServices);

const getTodosHandler = (req: Request, res: Response) => {
  const userIdRequest: UserIdRequest = { userId: req.body.userId };
  controller.getTodosHandler(userIdRequest, res);
};

const getTodoHandler = (req: Request, res: Response) => {
  const ownerTodoIdRequest = req as unknown as OwnerTodoIdRequest;
  ownerTodoIdRequest.user = { userId: req.body.userId };
  ownerTodoIdRequest.params = { id: { todoId: req.params.id } };
  controller.getTodoHandler(ownerTodoIdRequest, res);
};

const deleteTodoHandler = (req: Request, res: Response) => {
  const ownerTodoIdRequest = req as unknown as OwnerTodoIdRequest;
  ownerTodoIdRequest.user = { userId: req.body.userId};
  ownerTodoIdRequest.params = { id: {todoId: req.params.id}};
  controller.deleteTodoHandler(ownerTodoIdRequest, res);
}

router.get("/list", authorize, getTodosHandler);
router.get("/task/:id", authorize, getTodoHandler);
// router.post(
//   "/create",
//   authorize,
//   validator.createTodoRules,
//   validateResult,
//   newTodoHandler
// );
// router.put(
//   "/update/:id",
//   authorize,
//   validator.updateTodoRules,
//   validateResult,
//   updateTodoHandler
// );
router.delete("/delete/:id", authorize, deleteTodoHandler);

export default router;
