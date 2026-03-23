import { RegisterProfessorPayload } from "../../types/payloads/registerProfessorPayload"
import { RegisterStudentPayload } from "../../types/payloads/registerStudentPayload"

export type REGISTER_PAYLOAD_MAP = {
  STUDENT   : RegisterStudentPayload;
  PROFESSOR : RegisterProfessorPayload;
}