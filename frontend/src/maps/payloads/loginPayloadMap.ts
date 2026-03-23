import { LoginManagerPayload } from "../../types/payloads/loginManagerPayload";
import { RegisterStudentPayload } from "../../types/payloads/registerStudentPayload"

export type LOGIN_PAYLOAD_MAP = {
  STUDENT : RegisterStudentPayload;
  MANAGER : LoginManagerPayload;
}