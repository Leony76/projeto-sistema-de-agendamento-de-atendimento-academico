import type { RegisteredManager } from "@shared/types/registeredUsers.type";
import { MANAGERS } from "../../data/managers.mock";

export const REGISTERED_MANAGERS: RegisteredManager[] = MANAGERS.map((manager) => {

  const managerData: RegisteredManager = { ...manager };
  
  return managerData;
}); 