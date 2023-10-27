import Todo from "../models/Todo.js";

export const listActiveTodos = async function (requestUserId) {
  const userId = requestUserId;
  try {
    let activeTodos = await Todo.find({ user: userId }).exec();
    if (!activeTodos) {
      return {
        httpStatusCode: 404,
        message: "No active tasks found for active user",
      };
    }
    return { httpStatusCode: 200, message: "Tasks found", todos: activeTodos };
  } catch (error) {
    console.error("todoService, listActiveTodos: " + error.message);
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

export const listTodoByID = async function (requestUserId, requestTodoId) {
  const userId = requestUserId;
  const todoId = requestTodoId;
  try {
    const searchTodo = await Todo.findById(todoId).exec();
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
  } catch (error) {
    console.error(error.message);
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

export const createTodo = async function (requestUserId, requestBody) {
  const owner = requestUserId;
  const { title, description } = requestBody;
  try {
    let newTodo = await Todo.findOne({ title }).exec();
    if (newTodo) {
      return { httpStatusCode: 400, message: "Title already taken" };
    }
    newTodo = new Todo({
      title,
      description,
      completed: false,
      user: owner,
    });
    await newTodo.save();
    return {
      httpStatusCode: 200,
      message: "Todo created successfully",
      todo: newTodo,
    };
  } catch (error) {
    console.error("todoService, createTodo: " + error.message);
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

export const updateTodoByID = async function (requestUserId, requestBody) {
  const owner = requestUserId;
  const { id, title, description, completed } = requestBody;
  try {
    const updateTodo = await Todo.findById(id);
    if (!updateTodo) {
      return { httpStatusCode: 404, message: "Todo Not Found" };
    }
    if (updateTodo.user.toString() !== owner) {
      return {
        httpStatusCode: 401,
        message: "You're not the owner of this Todo",
      };
    }
    updateTodo.title = title;
    updateTodo.description = description;
    updateTodo.completed = completed;
    await updateTodo.save();
    return { httpStatusCode: 200, message: "Todo updated successfully" };
  } catch (error) {
    console.error("todoService, updateTodo: " + error.message);
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

export const deleteTodoByID = async function (requestUserId, requestBody) {
  const owner = requestUserId;
  const todoId = requestBody;

  try {
    const deleteTodo = await Todo.findById(todoId);
    if (!deleteTodo) {
      return { httpStatusCode: 404, message: "Todo not found" };
    }
    if (deleteTodo.user.toString() !== owner) {
      return {
        httpStatusCode: 401,
        message: "You're not the owner of this Todo",
      };
    }
    await deleteTodo.deleteOne();
    return { httpStatusCode: 200, message: "Todo Deleted Successfully" };
  } catch (error) {
    console.error("todoService, deleteTodo: " + error.message);
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};