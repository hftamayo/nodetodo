import mongoose from "mongoose";
import Todo from "@models/Todo";
import { FullTodo } from "@/types/todo.types";
import seedUsers from "./seedUsers";

async function seedTodos(session: mongoose.ClientSession) {
  try {
    const users = await seedUsers(session);
    if (!users) {
      throw new Error("Users not found in the database");
    }
    const userBob = users.find((user) => user.email === "bob@tamayo.com");
    if (!userBob) {
      throw new Error("User Bob not found in the database");
    }

    const todos: Omit<FullTodo, "_id">[] = [
      {
        title: "Foreign language class",
        description: "To learn a new language",
        completed: false,
        owner: userBob._id,
      },
    ];

    await Todo.deleteMany({}).session(session);
    const todosCreated = await Todo.create(todos, { session });
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
