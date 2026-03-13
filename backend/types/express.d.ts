import { UserRole } from "@prisma/client";
import { JwtPayload } from "jsonwebtoken";

export interface JwtUserPayload extends JwtPayload  {
  id: number;
  role: UserRole;
  email?: string;
}

declare global {
  namespace Express {
    interface Request {
      user?: JwtUserPayload;
    }
  }
}
