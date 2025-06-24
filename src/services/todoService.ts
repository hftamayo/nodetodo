import Todo from "@/models/Todo";
import {
  FullTodo,
  NewTodoRequest,
  UpdateTodoRequest,
  ListTodosByOwnerRequest,
  ListTodoByOwnerRequest,
  CreateTodoResponse,
  ListTodosByOwnerResponse,
  ListTodoByOwnerResponse,
  UpdateTodoResponse,
  DeleteTodoByIdResponse,
  FilteredTodo,
} from "@/types/todo.types";

const listTodos = async function (
  params: ListTodosByOwnerRequest
): Promise<ListTodosByOwnerResponse> {
  const { owner, page, limit, activeOnly } = params;
  try {
    const skip = (page - 1) * limit;
    const query: { owner: string; completed?: boolean } = {
      owner: owner,
    };

    if (activeOnly) {
      query["completed"] = false;
    }
    const todos = await Todo.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .exec();

    if (!todos || todos.length === 0) {
      return { httpStatusCode: 404, message: "TASKS_NOT_FOUND" };
    }

    const fetchedTodos: FullTodo[] = todos.map((todo) => ({
      _id: todo._id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      owner: todo.owner,
    }));

    return {
      httpStatusCode: 200,
      message: "TASKS_FOUND",
      todos: fetchedTodos,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, listTodos: " + error.message);
    } else {
      console.error("todoService, listTodos: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
  }
};

const listTodoByID = async function (
  params: ListTodoByOwnerRequest
): Promise<ListTodoByOwnerResponse> {
  const { owner, todoId } = params;

  try {
    let searchTodo = await Todo.findById(todoId).exec();

    if (!searchTodo) {
      return { httpStatusCode: 404, message: "ENTITY_NOT_FOUND" };
    }

    if (searchTodo.owner.toString() !== owner.toString()) {
      return {
        httpStatusCode: 401,
        message: "FORBIDDEN",
      };
    }

    const filteredTodo: FilteredTodo = {
      _id: searchTodo._id,
      title: searchTodo.title,
      description: searchTodo.description,
      completed: searchTodo.completed,
      owner: searchTodo.owner,
    };

    return { httpStatusCode: 200, message: "ENTITY_FOUND", todo: filteredTodo };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, listTodoByID: " + error.message);
    } else {
      console.error("todoService, listTodoByID: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
  }
};

const createTodo = async function (
  params: NewTodoRequest
): Promise<CreateTodoResponse> {
  const { owner, todo } = params;
  const { title, description } = todo;

  if (!owner || !title || !description) {
    return { httpStatusCode: 400, message: "MISSING_FIELDS" };
  }

  try {
    let newTodo = await Todo.findOne({ title }).exec();
    if (newTodo) {
      return { httpStatusCode: 400, message: "TITLE_ALREADY_TAKEN" };
    }
    newTodo = new Todo({
      title,
      description,
      completed: false,
      owner: owner,
    });
    await newTodo.save();

    const filteredTodo: FilteredTodo = {
      _id: newTodo._id,
      title: newTodo.title,
      description: newTodo.description,
      completed: newTodo.completed,
      owner: newTodo.owner,
    };

    return {
      httpStatusCode: 200,
      message: "TODO_CREATED",
      todo: filteredTodo,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, createTodo: " + error.message);
    } else {
      console.error("todoService, createTodo: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
  }
};

const updateTodoByID = async function (
  params: UpdateTodoRequest
): Promise<UpdateTodoResponse> {
  const { owner, todo } = params;
  const { _id, ...updates } = todo;

  if (!owner || !_id || Object.keys(updates).length === 0) {
    return { httpStatusCode: 400, message: "MISSING_FIELDS" };
  }

  try {
    let updateTodo = await Todo.findById(_id).exec();
    if (!updateTodo) {
      return { httpStatusCode: 404, message: "ENTITY_NOT_FOUND" };
    }
    if (updateTodo.owner.toString() !== owner.toString()) {
      return {
        httpStatusCode: 401,
        message: "FORBIDDEN",
      };
    }
    if (updates.title !== undefined) updateTodo.title = updates.title;
    if (updates.description !== undefined)
      updateTodo.description = updates.description;
    if (updates.completed !== undefined)
      updateTodo.completed = updates.completed;
    await updateTodo.save();

    const filteredTodo: FilteredTodo = {
      _id: updateTodo._id,
      title: updateTodo.title,
      description: updateTodo.description,
      completed: updateTodo.completed,
      owner: updateTodo.owner,
    };

    return {
      httpStatusCode: 200,
      message: "ENTITY_UPDATED",
      todo: filteredTodo,
    };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, updateTodo: " + error.message);
    } else {
      console.error("todoService, updateTodo: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
  }
};

const deleteTodoByID = async function (
  params: ListTodoByOwnerRequest
): Promise<DeleteTodoByIdResponse> {
  const { owner, todoId } = params;

  try {
    let searchTodo = await Todo.findById(todoId).exec();

    if (!searchTodo) {
      return { httpStatusCode: 404, message: "ENTITY_NOT_FOUND" };
    }

    if (searchTodo.owner.toString() !== owner.toString()) {
      return {
        httpStatusCode: 401,
        message: "FORBIDDEN",
      };
    }

    await searchTodo.deleteOne();
    return { httpStatusCode: 200, message: "ENTITY_DELETED" };
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, deleteTodo: " + error.message);
    } else {
      console.error("todoService, deleteTodo: " + error);
    }
    return { httpStatusCode: 500, message: "UNKNOWN_ERROR" };
  }
};

export default {
  listTodos,
  listTodoByID,
  createTodo,
  updateTodoByID,
  deleteTodoByID,
};
