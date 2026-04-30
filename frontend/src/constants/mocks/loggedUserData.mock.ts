import type { UserRole } from "@/types/userRole.type";

export const LOGGED_USER_DATA: { role: Exclude<UserRole, 'MANAGER'> } = {
  role: 'STUDENT',
}