const Todo = require("../models/Todo");

const listActiveTodos = async function (requestUserId) {
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

const listTodoByID = async function (requestUserId, requestTodoId) {
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

const createTodo = async function (requestUserId, requestBody) {
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

const updateTodoByID = async function (
  requestUserId,
  requestTodoId,
  requestBody
) {
  const owner = requestUserId;
  const todoId = requestTodoId;
  const { title, description, completed } = requestBody;

  try {
    let updateTodo = await Todo.findById(todoId);
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
    return {
      httpStatusCode: 200,
      message: "Todo updated successfully",
      todo: updateTodo,
    };
  } catch (error) {
    console.error("todoService, updateTodo: " + error.message);
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

const deleteTodoByID = async function (requestUserId, requestTodoId) {
  const owner = requestUserId;
  const todoId = requestTodoId;

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

module.exports = {
  listActiveTodos,
  listTodoByID,
  createTodo,
  updateTodoByID,
  deleteTodoByID,
};
