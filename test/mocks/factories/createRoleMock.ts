import { Model } from "mongoose";
import { RoleDocument } from "@/models/Role";

export const createRoleMock = (data: Partial<RoleDocument>) => {
  const mockSave = jest.fn().mockResolvedValue(data);
  return {
    save: mockSave,
    ...data,
  };
};
