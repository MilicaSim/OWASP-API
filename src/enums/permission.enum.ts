export enum Permission {
  // Admin level roles
  AdminUserManagement = 1, // Global admin that can manage all data
  AdminProduct = 2, // Admin that can manage product data

  // User level roles
  ViewUser = 5,
  AddEditUser = 6,
  DeleteUser =7
}
