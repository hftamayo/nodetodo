const express = require("express");
const authorize = require("../middleware/authorize");
const todoController = require("../controllers/todoController");
const {
  getTodos,
  getTodo,
  newTodo,
  updateTodo,
  deleteTodo,
} = require("../../services/todoService");
const { createTodoRules, updateTodoRules } = require("../middleware/validator");
const { validateResult } = require("../middleware/validationResults");
const router = express.Router();

todoController.setActiveTodos(getTodos);
todoController.setTodoByID(getTodo);
todoController.setCreateTodo(newTodo);
todoController.setUpdateTodoByID(updateTodo);
todoController.setDeleteTodoByID(deleteTodo);

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
router.post("/create", authorize, createTodoRules, validateResult, newTodoHandler);
router.post("/create", authorize, createTodoRules, validateResult);
router.put(
  "/update/:id",
  authorize,
  updateTodoRules,
  validateResult,
  updateTodoHandler
);
router.delete("/delete/:id", authorize, deleteTodoHandler);

module.exports = router;
