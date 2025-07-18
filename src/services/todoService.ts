import Todo from "@/models/Todo";
import {
  FullTodo,
  NewTodoRequest,
  UpdateTodoRequest,
  ListTodosByOwnerRequest,
  ListTodoByOwnerRequest,
  FilteredTodo,
  EntitiesResponse,
  EntityResponse,
  DeleteResponse,
} from "@/types/todo.types";
import { makeResponse } from "@/utils/messages/apiMakeResponse";

const listTodos = async function (
  params: ListTodosByOwnerRequest
): Promise<EntitiesResponse> {
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
      return makeResponse("ERROR");
    }

    const fetchedTodos: FullTodo[] = todos.map((todo) => ({
      _id: todo._id,
      title: todo.title,
      description: todo.description,
      completed: todo.completed,
      owner: todo.owner,
    }));
    return makeResponse("SUCCESS", {
      data: fetchedTodos,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, listTodos: " + error.message);
    } else {
      console.error("todoService, listTodos: " + error);
    }
    return makeResponse("INTERNAL_SERVER_ERROR");
  }
};

const listTodoByID = async function (
  params: ListTodoByOwnerRequest
): Promise<EntityResponse> {
  const { owner, todoId } = params;

  try {
    let searchTodo = await Todo.findById(todoId).exec();

    if (!searchTodo) {
      return makeResponse("ERROR");
    }

    if (searchTodo.owner.toString() !== owner.toString()) {
      return makeResponse("UNAUTHORIZED");
    }

    const filteredTodo: FilteredTodo = {
      _id: searchTodo._id,
      title: searchTodo.title,
      description: searchTodo.description,
      completed: searchTodo.completed,
      owner: searchTodo.owner,
    };
    return makeResponse("SUCCESS", {
      data: filteredTodo,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, listTodoByID: " + error.message);
    } else {
      console.error("todoService, listTodoByID: " + error);
    }
    return makeResponse("INTERNAL_SERVER_ERROR");
  }
};

const createTodo = async function (
  params: NewTodoRequest
): Promise<EntityResponse> {
  const { owner, todo } = params;
  const { title, description } = todo;

  if (!owner || !title || !description) {
    return makeResponse("BAD_REQUEST");
  }

  try {
    let newTodo = await Todo.findOne({ title }).exec();
    if (newTodo) {
      return makeResponse("ENTITY_ALREADY_EXISTS");
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

    return makeResponse("SUCCESS", {
      data: filteredTodo,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, createTodo: " + error.message);
    } else {
      console.error("todoService, createTodo: " + error);
    }
    return makeResponse("INTERNAL_SERVER_ERROR");
  }
};

const updateTodoByID = async function (
  params: UpdateTodoRequest
): Promise<EntityResponse> {
  const { owner, todo } = params;
  const { _id, ...updates } = todo;

  if (!owner || !_id || Object.keys(updates).length === 0) {
    return makeResponse("BAD_REQUEST");
  }

  try {
    let updateTodo = await Todo.findById(_id).exec();
    if (!updateTodo) {
      return makeResponse("ERROR");
    }
    if (updateTodo.owner.toString() !== owner.toString()) {
      return makeResponse("UNAUTHORIZED");
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

    return makeResponse("SUCCESS", {
      data: filteredTodo,
    });
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, updateTodo: " + error.message);
    } else {
      console.error("todoService, updateTodo: " + error);
    }
    return makeResponse("INTERNAL_SERVER_ERROR");
  }
};

const deleteTodoByID = async function (
  params: ListTodoByOwnerRequest
): Promise<DeleteResponse> {
  const { owner, todoId } = params;

  try {
    let searchTodo = await Todo.findById(todoId).exec();

    if (!searchTodo) {
      return makeResponse("ERROR");
    }

    if (searchTodo.owner.toString() !== owner.toString()) {
      return makeResponse("UNAUTHORIZED");
    }

    await searchTodo.deleteOne();
    return makeResponse("SUCCESS");
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error("todoService, deleteTodo: " + error.message);
    } else {
      console.error("todoService, deleteTodo: " + error);
    }
    return makeResponse("INTERNAL_SERVER_ERROR");
  }
};

export default {
  listTodos,
  listTodoByID,
  createTodo,
  updateTodoByID,
  deleteTodoByID,
};
