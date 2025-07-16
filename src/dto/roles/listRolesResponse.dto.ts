import { FilteredRoleDto } from './filteredRole.dto';

export class ListRolesResponseDto {
  httpStatusCode!: number;
  message!: string;
  roles?: FilteredRoleDto[];

  constructor(partial: Partial<ListRolesResponseDto>) {
    Object.assign(this, partial);
  }
} 