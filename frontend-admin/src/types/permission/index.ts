export interface Permission {
  id: number;
  name: string;
  description: string;
}

export interface RoleWithPermissions {
  id: number;
  roleCode: string;
  roleName: string;
  permissions: Permission[];
}
