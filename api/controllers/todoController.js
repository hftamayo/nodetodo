import {
  listActiveTodos,
  listTodoByID,
  createTodo,
  updateTodoByID,
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
    req.todoId
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
  const { httpStatusCode, message, todo } = await createTodo(
    req.user,
    req.body
  );
  if (httpStatusCode === 200) {
    res.status(httpStatusCode).json({ resultMessage: message, newTodo: todo });
  } else {
    res.status(httpStatusCode).json({ resultMessage: message });
  }
};

export const updateTodo = async (req, res) => {
  const { httpStatusCode, message, todo } = await updateTodoByID(
    req.user,
    req.body
  );
  res.status(httpStatusCode).json({ resultMessage: message, updateTodo: todo });
};

export const deleteTodo = async (req, res) => {
  const { httpStatusCode, message } = await deleteTodoByID(req.user, req.body);
  res.status(httpStatusCode).json({ resultMessage: message });
};
