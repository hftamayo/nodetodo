const expect = require("chai").expect;
const sinon = require("sinon");
const { newTodo, existingTodo, updateTodo } = require("../mocks/todo.mock");
const todoService = require("../../src/services/todoService");

describe("TodoService Unit Tests", () => {
    afterEach(function () {
        sinon.restore();
    });
    
    describe("createTodo()", () => {
        it("should create a new todo with valid data", async () => {
        const requestBody = {
            title: newTodo.title,
            description: newTodo.description,
            completed: newTodo.completed,
            user: newTodo.user,
        };
    
        const mockResponse = {
            httpStatusCode: 200,
            message: "Todo created successfully",
});