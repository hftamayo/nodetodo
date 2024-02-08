const Todo  = require("../../src/models/Todo");
const User = require("../../src/models/User");
const mongoose = require("mongoose");

const getRandomInt = (max) => {
    return Math.floor(Math.random() * Math.floor(max));
  };

const newTodo = (userId = new mongoose.Types.ObjectId()) => ({
    title: `New Todo${getRandomInt(1000000)}`,
    description: "New Todo Description",
    completed: false,
    user: userId,
});

const todoSupervisor = {
    title: "Gym",
    description: "To exercise",
    completed: false,
    user: "5f7f8b1e9f3f9c1d6c1e4d1f",
};

const updateTodo = {
    title: "Update Todo",
    description: "Update Todo Description",
    completed: true,
};

const deleteTodo = {
    id: "222222222",
}

module.exports = {
    newTodo,
    todoSupervisor,
    updateTodo,
    deleteTodo,
};