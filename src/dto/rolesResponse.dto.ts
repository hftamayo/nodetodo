export type RoleDTO = {
  id: string;
  name: string;
  description: string;
  status: boolean;
  permissions: { [domain: string]: number };
};

export class RolesResponseDTO {
  code: number;
  resultMessage: string;
  [key: string]: any;

  constructor(options: {
    code: number;
    resultMessage: string;
    data?: any;
    dataKey?: string;
  }) {
    this.code = options.code;
    this.resultMessage = options.resultMessage;
    if (options.data && options.dataKey) {
      this[options.dataKey] = Array.isArray(options.data)
        ? options.data.map(RolesResponseDTO.filterRole)
        : RolesResponseDTO.filterRole(options.data);
    }
  }

  private static filterRole(role: any): RoleDTO {
    return {
      id: role._id,
      name: role.name,
      description: role.description,
      status: role.status,
      permissions: role.permissions,
    };
  }
} 