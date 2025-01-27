import Todo from "../models/Todo";
import {
  FullTodo,
  NewTodoRequest,
  UpdateTodoRequest,
  ListTodosByOwnerRequest,
  ListTodoByOwnerRequest,
  CreateTodoResponse,
  ListTodosByOwnerResponse,
  ListTodoByOwnerResponse,
  UpdateTodoResponse,
  DeleteTodoByIdResponse,
} from "../types/todo.types";
import { UserIdRequest } from "../types/user.types";

const listTodos = async function (
  params: ListTodosByOwnerRequest
): Promise<ListTodosByOwnerResponse> {
  const { owner, page, limit, activeOnly } = params;
  try {
    const skip = (page - 1) * limit;
    const query: { owner: string; completed?: boolean } = {
      owner: owner.userId,
    };

    if (activeOnly) {
      query["completed"] = false;
    }
    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    if (!todos || todos.length === 0) {
      return { httpStatusCode: 404, message: "TASKS_NOT_FOUND" };
    }

    const fetchedTodos: FullTodo[] = todos.map((todo) => ({
      _id: todo._id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      owner: todo.owner,
    }));

    return {
      httpStatusCode: 200,
      message: "TASKS_FOUND",
      todos: fetchedTodos,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, listTodos: " + error.message);
    } else {
      console.error("todoService, listTodos: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
  }
};

const listTodoByID = async function (req: OwnerTodoIdRequest) {
  const userId = req.user.userId;
  const todoId = req.params.todoId;

  try {
    let searchTodo = await Todo.findById(todoId).exec();

    if (!searchTodo) {
      return { httpStatusCode: 404, message: "Task Not Found" };
    }

    if (searchTodo.user.toString() !== userId) {
      return {
        httpStatusCode: 400,
        message: "There's a problem with your credentials",
      };
    }
    return { httpStatusCode: 200, message: "Todo found", todo: searchTodo };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, listTodoByID: " + error.message);
    } else {
      console.error("todoService, listTodoByID: " + error);
    }
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const createTodo = async function (req: NewTodoRequest) {
  const owner = req.owner;
  const { title, description } = req.todo;
  try {
    let newTodo = await Todo.findOne({ title }).exec();
    if (newTodo) {
      return { httpStatusCode: 400, message: "Title already taken" };
    }
    newTodo = new Todo({
      title,
      description,
      completed: false,
      user: owner.userId,
    });
    await newTodo.save();
    return {
      httpStatusCode: 200,
      message: "Todo created successfully",
      todo: newTodo,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, createTodo: " + error.message);
    } else {
      console.error("todoService, createTodo: " + error);
    }
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const updateTodoByID = async function (req: UpdateTodoRequest) {
  const owner = req.owner;
  const todoId = req.todo._id;
  const { title, description, completed } = req.todo;

  try {
    let updateTodo = await Todo.findById(todoId);
    if (!updateTodo) {
      return { httpStatusCode: 404, message: "Todo Not Found" };
    }
    if (updateTodo.user.toString() !== owner.userId.toString()) {
      return {
        httpStatusCode: 401,
        message: "You're not the owner of this Todo",
      };
    }
    updateTodo.title = title ?? "";
    updateTodo.description = description ?? "";
    updateTodo.completed = completed ?? false;
    await updateTodo.save();
    return {
      httpStatusCode: 200,
      message: "Todo updated successfully",
      todo: updateTodo,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, updateTodo: " + error.message);
    } else {
      console.error("todoService, updateTodo: " + error);
    }
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const deleteTodoByID = async function (req: OwnerTodoIdRequest) {
  const owner = req.user;
  const todoId = req.params.todoId;

  try {
    const deleteTodo = await Todo.findById(todoId);
    if (!deleteTodo) {
      return { httpStatusCode: 404, message: "Todo not found" };
    }
    if (deleteTodo.user.toString() !== owner.userId.toString()) {
      return {
        httpStatusCode: 401,
        message: "You're not the owner of this Todo",
      };
    }

    await deleteTodo.deleteOne();
    return { httpStatusCode: 200, message: "Todo Deleted Successfully" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, deleteTodo: " + error.message);
    } else {
      console.error("todoService, deleteTodo: " + error);
    }
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

export default {
  listActiveTodos,
  listTodoByID,
  createTodo,
  updateTodoByID,
  deleteTodoByID,
};
