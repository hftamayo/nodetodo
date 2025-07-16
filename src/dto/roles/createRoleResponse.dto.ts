import { FilteredRoleDto } from './filteredRole.dto';

export class CreateRoleResponseDto {
  httpStatusCode!: number;
  message!: string;
  role?: FilteredRoleDto;

  constructor(partial: Partial<CreateRoleResponseDto>) {
    Object.assign(this, partial);
  }
} 