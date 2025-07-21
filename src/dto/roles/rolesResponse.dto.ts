import { FilteredRole } from "@/types/role.types";

export class RolesResponseDTO {
  id: string;
  [key: string]: FilteredRole[keyof FilteredRole];

  constructor(role: FilteredRole) {
    this.id = (role as any)._id?.toString?.() ?? (role as any).id;
    Object.entries(role).forEach(([key, value]) => {
      if (key !== "_id" && key !== "id") this[key] = value;
    });
  }
} 