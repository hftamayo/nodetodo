import express from "express";
import authorize from "../middleware/authorize.js";
import {
  getTodo,
  getTodos,
  newTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";
import { createTodoRules, updateTodoRules } from "../middleware/validator.js";
import { validateResult } from "../middleware/validationResults.js";

const router = express.Router();
router.get("/:id", authorize, getTodo);
router.get("/list", authorize, getTodos);
router.post("/create", authorize, createTodoRules, validateResult, newTodo);
router.put(
  "/update/:id",
  authorize,
  updateTodoRules,
  validateResult,
  updateTodo
);
router.delete("/delete/:id", authorize, deleteTodo);

export default router;
