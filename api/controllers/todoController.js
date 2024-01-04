const {
  listActiveTodos,
  listTodoByID,
  createTodo,
  updateTodoByID,
  deleteTodoByID,
} = require("../../services/todoService.js");

const getTodos = async (req, res) => {
  const { httpStatusCode, message, todos } = await listActiveTodos(req.user);

  res
    .status(httpStatusCode)
    .json(
      httpStatusCode === 200
        ? { resultMessage: message, activeTodos: todos }
        : { resultMessage: message }
    );
};

const getTodo = async (req, res) => {
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

const newTodo = async (req, res) => {
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

const updateTodo = async (req, res) => {
  const { httpStatusCode, message, todo } = await updateTodoByID(
    req.user,
    req.params.id,
    req.body
  );
  res.status(httpStatusCode).json({ resultMessage: message, updateTodo: todo });
};

const deleteTodo = async (req, res) => {
  const { httpStatusCode, message } = await deleteTodoByID(
    req.user,
    req.params.id
  );
  res.status(httpStatusCode).json({ resultMessage: message });
};

module.exports = {
  getTodos,
  getTodo,
  newTodo,
  updateTodo,
  deleteTodo,
};