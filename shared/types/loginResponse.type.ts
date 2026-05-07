import { AuthUserBasicInfos } from "./authUserBasicInfos.type";

export type LoginResponse = {
  user  : AuthUserBasicInfos,
  token : string;
};