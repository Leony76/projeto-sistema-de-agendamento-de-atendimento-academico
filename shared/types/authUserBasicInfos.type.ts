import { LoginAsStudentResponse, LoginAsProfessorResponse, LoginAsManagerResponse } from "./loginResponse.type";

export type AuthUserBasicInfos = 
| LoginAsStudentResponse
| LoginAsProfessorResponse
| LoginAsManagerResponse
;