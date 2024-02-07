const mongoose = require("mongoose");
const Todo = require("../models/Todo");

const seedTodos = async function () {
  const todos = [
    {
      _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d1d"),
      title: "Foreign language class",
      description: "To learn a new language",
      completed: false,
      user: "5f7f8b1e9f3f9c1d6c1e4d1e",
    },
    {
      _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d1f"),
      title: "Gym",
      description: "To exercise",
      completed: false,
      user: "5f7f8b1e9f3f9c1d6c1e4d1f",
    },
    {
      _id: new mongoose.Types.ObjectId("5f7f8b1e9f3f9c1d6c1e4d20"),
      title: "Buy groceries",
      description: "To buy food",
      completed: false,
      user: "5f7f8b1e9f3f9c1d6c1e4d20",
    },
  ];

  try {
    await Todo.deleteMany({});
    const todosCreated = await Todo.create(todos);
    console.log("Todos created: ", todosCreated);
  } catch (error) {
    console.error("seedTodos: ", error.message);
  }
};

module.exports = seedTodos;
