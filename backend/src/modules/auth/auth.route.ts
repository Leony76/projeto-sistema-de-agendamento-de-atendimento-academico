import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '@backend/utils/validator.util';
import { newManagerSchema, newProfessorSchema, newStudentSchema } from '@shared/schemas/newUser.schema';
import { studentRegisterHimselfSchema } from '@shared/schemas/studentRegistersHimself.schema';
import { loginAsGenericSchema, loginAsStudentSchema } from '@shared/schemas/login.schema';

const authRoutes = Router();

authRoutes.post('/manager/register/student', 
  validate(newStudentSchema), 
  AuthController.managerRegistersStudent 
);

authRoutes.post('/manager/register/professor',
  validate(newProfessorSchema)            ,
  AuthController.managerRegistersProfessor 
);

authRoutes.post('/manager/register/manager',
  validate(newManagerSchema),
  AuthController.managerRegistersManager 
);

authRoutes.post( '/register/student',
  validate(studentRegisterHimselfSchema) ,
  AuthController.studentRegistersHimself 
);

authRoutes.post('/login/student',
  validate(loginAsStudentSchema),
  AuthController.loginAsStudent 
);

authRoutes.post('/login/generic',
  validate(loginAsGenericSchema),
  AuthController.loginAsGeneric 
);

export default authRoutes;