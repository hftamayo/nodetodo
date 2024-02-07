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
