import express from "express";
import authorize from "../middleware/authorize.js";
import {
  getTodo,
  getTodos,
  createTodo,
  updateTodo,
  deleteTodo,
} from "../controllers/todoController.js";

const router = express.Router();
router.get("/:id", authorize, getTodo);
router.get("/", authorize, getTodos);
router.post("/create", authorize, createTodo);
router.put("/update/:id", authorize, updateTodo);
router.delete("/delete/:id", authorize, deleteTodo);

export default router;
