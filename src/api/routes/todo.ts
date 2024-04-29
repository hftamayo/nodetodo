import express, {Request, Response} from "express";
import authorize from "../middleware/authorize";
import validator from "../middleware/validator";
import  validateResult  from "../middleware/validationResults";
import todoService from "../../services/todoService";
import todoController from "../controllers/todoController";
import {
  TodoRequest,
  TodoIdRequest,
  OwnerTodoIdRequest,
  OwnerTodoBodyRequest,
  TodoResult,
} from "../../types/todo.interface";

const router = express.Router();

todoController.setActiveTodos(listActiveTodos);
todoController.setTodoByID(listTodoByID);
todoController.setCreateTodo(createTodo);
todoController.setUpdateTodoByID(updateTodoByID);
todoController.setDeleteTodoByID(deleteTodoByID);

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
