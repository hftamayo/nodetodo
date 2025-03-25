import roleService from "@/services/roleService";
import Role from "@/models/Role";
import { ListRolesRequest } from "@/types/role.types";
import { mockRolesData, expectedFilteredRoles } from "../mocks/role.mock";

jest.mock("@/models/Role");
