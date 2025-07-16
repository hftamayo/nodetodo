export class RoleRequestDto {
  _id?: string;
  name!: string;
  description!: string;
  status?: boolean;
  permissions!: { [domain: string]: number };

  constructor(partial: Partial<RoleRequestDto>) {
    Object.assign(this, partial);
  }
} 