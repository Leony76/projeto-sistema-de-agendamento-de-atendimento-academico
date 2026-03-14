import { UserDTO } from "../dtos/userDTO";

export type LoginPromise = {
  token: string;
  user: UserDTO;
};