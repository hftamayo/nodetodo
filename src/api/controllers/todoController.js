let listActiveTodos;
let listTodoByID;
let createTodo;
let updateTodoByID;
let deleteTodoByID;

const todoController = {
  setActiveTodos: function (newActiveTodos) {
    listActiveTodos = newActiveTodos;
  },
  setTodoByID: function (newTodoByID) {
    listTodoByID = newTodoByID;
  },
  setCreateTodo: function (newCreateTodo) {
    createTodo = newCreateTodo;
  },
  setUpdateTodoByID: function (newUpdateTodoByID) {
    updateTodoByID = newUpdateTodoByID;
  },
  setDeleteTodoByID: function (newDeleteTodoByID) {
    deleteTodoByID = newDeleteTodoByID;
  },

  getTodosHandler: async function (req, res) {
    try {
      const { httpStatusCode, message, todos } = await listActiveTodos(
        req.user
      );
      res
        .status(httpStatusCode)
        .json(
          httpStatusCode === 200
            ? { resultMessage: message, activeTodos: todos }
            : { resultMessage: message }
        );
    } catch (error) {
      console.error("todoController, getTodos: " + error.message);
      res.status(500).json({ resultMessage: "Internal Server Error" });
    }
  },

  getTodoHandler: async function (req, res) {
    try {
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
    } catch (error) {
      console.error("todoController, getTodo: " + error.message);
      res.status(500).json({ resultMessage: "Internal Server Error" });
    }
  },

  newTodoHandler: async function (req, res) {
    try {
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
    } catch (error) {
      console.error("todoController, newTodo: " + error.message);
      res.status(500).json({ resultMessage: "Internal Server Error" });
    }
  },

  updateTodoHandler: async function (req, res) {
    try {
      const { httpStatusCode, message, todo } = await updateTodoByID(
        req.user,
        req.params.id,
        req.body
      );
      res
        .status(httpStatusCode)
        .json({ resultMessage: message, updateTodo: todo });
    } catch (error) {
      console.error("todoController, updateTodo: " + error.message);
      res.status(500).json({ resultMessage: "Internal Server Error" });
    }
  },

  deleteTodoHandler: async function (req, res) {
    try {
      const { httpStatusCode, message } = await deleteTodoByID(
        req.user,
        req.params.id
      );
      res.status(httpStatusCode).json({ resultMessage: message });
    } catch (error) {
      console.error("todoController, deleteTodo: " + error.message);
      res.status(500).json({ resultMessage: "Internal Server Error" });
    }
  },
};

module.exports = todoController;
