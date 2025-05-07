import { Model } from "mongoose";
import { RoleDocument } from "@/types/role.types";

export const createRoleMock = (data: Partial<RoleDocument>) => {
  const mockSave = jest.fn().mockResolvedValue(data);
  return {
    save: mockSave,
    ...data,
  };
};
