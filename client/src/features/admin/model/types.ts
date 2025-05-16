export interface Employee {
  id: number;
  email: string;
  fullName?: string;
  roleId: number;
  instituteId?: number;
}

export interface Role {
  id: number;
  name: string;
}
