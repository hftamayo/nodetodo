import { FilteredTodo } from "@/types/todo.types";

export class TodosResponseDTO {
  id: string;
  [key: string]: FilteredTodo[keyof FilteredTodo];

  constructor(todo: FilteredTodo) {
    this.id = (todo as any)._id?.toString?.() ?? (todo as any).id;
    Object.entries(todo).forEach(([key, value]) => {
      if (key !== "_id" && key !== "id") this[key] = value;
    });
  }
} 