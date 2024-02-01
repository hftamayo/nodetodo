const Todo  = require("../../src/models/Todo");
const User = require("../../src/models/User");
const mongoose = require("mongoose");

const newTodo = (userId = new mongoose.Types.ObjectId()) => ({
    title: "New Todo",
    description: "New Todo Description",
    completed: false,
    user: userId,
});

const existingTodo = {
    _id: new mongoose.Types.ObjectId(),
    title: "Existing Todo",
    description: "Existing Todo Description",
    completed: true,
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