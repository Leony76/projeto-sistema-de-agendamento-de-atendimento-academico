import { UserRole } from "@prisma/client";

type JwtUserPayload = {
  id: number;
  email: string;
  role: UserRole;
};

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}
