import { UserDTO } from "../../../../@types/dto/userDTO";

export type LoginAsStudentPromise = {
  error: string;
  token?: undefined;
  user?: undefined;
} | {
  token: string;
  user: UserDTO;
  error?: undefined;
}