const Todo  = require("../models/Todo");
const User = require("../models/User");

const newTodo = (userId = new mongoose.Types.ObjectId()) => ({
    title: "New Todo",
    description: "New Todo Description",
    completed: false,
    user: userId,
});

const updateTodo = {
    title: "Update Todo",
    description: "Update Todo Description",
    completed: true,
};

