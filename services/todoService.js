import Todo from "../../models/Todo.js";

export const listActiveTodos = async function (requestUserId) {
  const userId = requestUserId;
  try {
    let activeTodos = await Todo.find({ user: userId }).exec();
    if (!activeTodos) {
      return {
        httpStatusCode: 404,
        message: "No active tasks found for this user",
      };
    }
    return { httpStatusCode: 200, message: "Tasks found", todos: activeTodos };
  } catch (error) {
    console.error("todoService, getTodos: " + error.message);
    return { httpStatusCode: 500, message: "Internal Server Error" };
  }
};

export const listTodoByID = async function (requestTodoId, requestBody) {
  const todoId = requestTodoId;
  const { userId } = requestBody;
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
    return { httpStatusCode: 200, msg: "Todo found", searchTodo };
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ errors: "Internal Server Error" });
  }
};

export const createTodo = async function (requestBody) {
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
      user: req.user,
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

export const updateTodo = async function (
  requestTodoId,
  requestUserId,
  requestBody
) {
  const todoId = requestTodoId;
  const owner = requestUserId;
  const { title, description, completed } = requestBody;
  try {
    const updateTodo = await Todo.findById(todoId);
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

export const deleteTodo = async (req, res) => {
  const { id } = req.params;
  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ msg: "Todo Not Found" });
    }
    if (todo.user.toString() !== req.user) {
      return res.status(401).json({ msg: "Not Authorized" });
    }
    await todo.deleteOne();
    res.status(200).json({ msg: "Todo Deleted Successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ errors: "Internal Server Error" });
  }
};
