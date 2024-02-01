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

const existingTodo = {
    _id: new mongoose.Types.ObjectId(),
    title: "Foreign language class",
    description: "learn a new language",
    completed: false,
    user: new mongoose.Types.ObjectId(),
};

const updateTodo = {
    title: "Update Todo",
    description: "Update Todo Description",
    completed: true,
};

module.exports = {
    newTodo,
    existingTodo,
    updateTodo,
};