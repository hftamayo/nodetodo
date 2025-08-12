import { FilteredUser } from "@/types/user.types";

export class UsersResponseDTO {
  id: string;
  [key: string]: FilteredUser[keyof FilteredUser];

  constructor(user: FilteredUser) {
    this.id = (user as any)._id?.toString?.() ?? (user as any).id;
    Object.entries(user).forEach(([key, value]) => {
      if (key !== "_id" && key !== "id") this[key] = value;
    });
  }
} 