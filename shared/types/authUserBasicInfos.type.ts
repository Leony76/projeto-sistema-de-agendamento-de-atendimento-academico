import type { LoginAsStudentResponse, LoginAsProfessorResponse, LoginAsManagerResponse } from '@shared/types/dtos/login.type.dto';

export type AuthUserBasicInfos = 
| LoginAsStudentResponse
| LoginAsProfessorResponse
| LoginAsManagerResponse
;