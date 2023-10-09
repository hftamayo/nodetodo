import {
  listActiveTodos,
  listTodoByID,
  createTodo,
  updateTodo,
  deleteTodoByID,
} from "../../services/todoService";

export const getTodos = async (req, res) => {
  const { httpStatusCode, message, todos } = await listActiveTodos(req.user);
  if (httpStatusCode === 200) {
    res
      .status(httpStatusCode)
      .json({ resultMessage: message, activeTodos: todos });
  } else {
    res.status(httpStatusCode).json({ resultMessage: message });
  }
};

export const getTodo = async (req, res) => {
  const { httpStatusCode, message, todo } = await listTodoByID(
    req.user,
    req.todo
  );
  if (httpStatusCode === 200) {
    res
      .status(httpStatusCode)
      .json({ resultMessage: message, searchTodo: todo });
  } else {
    res.status(httpStatusCode).json({ resultMessage: message });
  }
};

export const newTodo = async (req, res) => {
  const { httpStatusCode, message, todo } = await createTodo(req.body);
  if (httpStatusCode === 200) {
    res.status(httpStatusCode).json({ resultMessage: message, newTodo: todo });
  } else {
    res.status(httpStatusCode).json({ resultMessage: message });
  }
};

export const updateTodo = async (req, res) => {
  const { id } = req.params;
  const { title, description, completed } = req.body;
  try {
    const todo = await Todo.findById(id);
    if (!todo) {
      return res.status(404).json({ msg: "Todo Not Found" });
    }
    if (todo.user.toString() !== req.user) {
      return res.status(401).json({ msg: "Not Authorized" });
    }
    todo.title = title;
    todo.description = description;
    todo.completed = completed;
    await todo.save();
    res.status(200).json({ msg: "Todo updated successfully" });
  } catch (error) {
    console.error(error.message);
    res.status(500).send({ errors: "Internal Server Error" });
  }
};

export const removeTodo = async (req, res) => {
  const { httpStatusCode, message } = await deleteTodoByID(req.todo);
  res.status(httpStatusCode).json({ resultMessage: message });
};

