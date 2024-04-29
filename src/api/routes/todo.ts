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

const getTodosHandler = (req, res) => {
  todoController.getTodosHandler(req, res);
};

const getTodoHandler = (req, res) => {
  todoController.getTodoHandler(req, res);
};

const newTodoHandler = (req, res) => {
  todoController.newTodoHandler(req, res);
};

const updateTodoHandler = (req, res) => {
  todoController.updateTodoHandler(req, res);
};

const deleteTodoHandler = (req, res) => {
  todoController.deleteTodoHandler(req, res);
};

router.get("/list", authorize, getTodosHandler);
router.get("/task/:id", authorize, getTodoHandler);
router.post(
  "/create",
  authorize,
  createTodoRules,
  validateResult,
  newTodoHandler
);
router.put(
  "/update/:id",
  authorize,
  updateTodoRules,
  validateResult,
  updateTodoHandler
);
router.delete("/delete/:id", authorize, deleteTodoHandler);

module.exports = router;
