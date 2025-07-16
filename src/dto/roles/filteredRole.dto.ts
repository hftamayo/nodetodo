export class FilteredRoleDto {
  _id!: string;
  name!: string;
  description!: string;
  status!: boolean;
  permissions!: { [domain: string]: number };

  constructor(partial: Partial<FilteredRoleDto>) {
    Object.assign(this, partial);
  }
} 