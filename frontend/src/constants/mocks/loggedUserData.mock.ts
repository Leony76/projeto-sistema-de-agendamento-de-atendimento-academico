import type { UserRole } from "@shared/types/userRole.type";

export const LOGGED_USER_DATA: { role: Exclude<UserRole, 'MANAGER'> } = {
  role: 'STUDENT',
}