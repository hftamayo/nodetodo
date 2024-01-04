const express = require("express");
const authorize = require("../middleware/authorize.js");
const {
  getTodo,
  getTodos,
  newTodo,
  updateTodo,
  deleteTodo,
} = require("../controllers/todoController.js");
const { createTodoRules, updateTodoRules } = require("../middleware/validator.js");
const { validateResult } = require("../middleware/validationResults.js");

const router = express.Router();
router.get("/list", authorize, getTodos);
router.get("/task/:id", authorize, getTodo);
router.post("/create", authorize, createTodoRules, validateResult, newTodo);
router.put(
  "/update/:id",
  authorize,
  updateTodoRules,
  validateResult,
  updateTodo
);
router.delete("/delete/:id", authorize, deleteTodo);

module.exports = router;