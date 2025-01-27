import mongoose from "mongoose";
import Todo from "../models/Todo";
import { FullTodo } from "../types/todo.types";

const todos: FullTodo[] = [
  {
    _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d1d"),
    title: "Foreign language class",
    description: "To learn a new language",
    completed: false,
    owner: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d1e"),
  },
];

async function seedTodos() {
  try {
    await Todo.deleteMany({});
    const todosCreated = await Todo.create(todos);
    console.log("Todos created: ", todosCreated);
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("seedTodos: ", error.message);
    } else {
      console.error("seedTodos: ", error);
    }
  }
}

export default seedTodos;
