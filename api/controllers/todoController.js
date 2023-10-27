import {
  listActiveTodos,
  listTodoByID,
  createTodo,
  updateTodoByID,
  deleteTodoByID,
} from "../../services/todoService.js";

export const getTodos = async (req, res) => {
  const { httpStatusCode, message, todos } = await listActiveTodos(req.user);

  res
    .status(httpStatusCode)
    .json(
      httpStatusCode === 200
        ? { resultMessage: message, activeTodos: todos }
        : { resultMessage: message }
    );
};

export const getTodo = async (req, res) => {
  const { httpStatusCode, message, todo } = await listTodoByID(
    req.user,
    req.params.id
  );
  res
    .status(httpStatusCode)
    .json(
      httpStatusCode === 200
        ? { resultMessage: message, searchTodo: todo }
        : { resultMessage: message }
    );
};

export const newTodo = async (req, res) => {
  const { httpStatusCode, message, todo } = await createTodo(
    req.user,
    req.body
  );
  res
    .status(httpStatusCode)
    .json(
      httpStatusCode === 200
        ? { resultMessage: message, newTodo: todo }
        : { resultMessage: message }
    );
};

export const updateTodo = async (req, res) => {
  const { httpStatusCode, message, todo } = await updateTodoByID(
    req.user,
    req.params.id,
    req.body
  );
  res.status(httpStatusCode).json({ resultMessage: message, updateTodo: todo });
};

export const deleteTodo = async (req, res) => {
  const { httpStatusCode, message } = await deleteTodoByID(req.user, req.params.id);
  res.status(httpStatusCode).json({ resultMessage: message });
};
