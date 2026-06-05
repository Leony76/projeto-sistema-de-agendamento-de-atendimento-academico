import type { UserRole } from "@backend/generated/prisma/enums";

export type TokenPayload = {
  sub  : number;
  role : UserRole;
};