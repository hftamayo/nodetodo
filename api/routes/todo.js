const express = require("express");
const authorize = require("../middleware/authorize");
const {
  getTodo,
  getTodos,
  newTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController");
const { createTodoRules, updateTodoRules } = require("../middleware/validator");
const { validateResult } = require("../middleware/validationResults");

const router = express.Router();
router.get("/list", authorize, getTodos);
router.get("/task/:id", authorize, getTodo);
router.post("/create", authorize, createTodoRules, validateResult, newTodo);
router.post("/create", authorize, createTodoRules, validateResult);
router.put(
  "/update/:id",
  authorize,
  updateTodoRules,
  validateResult,
  updateTodo
);
router.delete("/delete/:id", authorize, deleteTodo);

module.exports = router;