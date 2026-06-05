import { Router } from 'express';
import { AuthController } from './auth.controller';
import { validate } from '@backend/utils/validator.util';
import { newManagerSchema, newProfessorSchema, newStudentSchema,  } from '@backend/schemas/newUser.schema'; 
import { studentRegisterHimselfSchema } from '@backend/schemas/studentRegistersHimself.schema'; 
import { loginAsGenericSchema, loginAsStudentSchema } from '@backend/schemas/login.schema'; 
import { loginLimiter, managerRegisterUsersLimiter, studentRegisterHimselfLimiter } from '@backend/utils/requestLimit.util';

const authRoutes = Router();

authRoutes.post('/manager/register/student', 
  validate(newStudentSchema),
  managerRegisterUsersLimiter,
  AuthController.managerRegistersStudent 
);

authRoutes.post('/manager/register/professor',
  validate(newProfessorSchema),
  managerRegisterUsersLimiter,
  AuthController.managerRegistersProfessor 
);

authRoutes.post('/manager/register/manager',
  validate(newManagerSchema),
  managerRegisterUsersLimiter,
  AuthController.managerRegistersManager 
);

authRoutes.post( '/register/student',
  validate(studentRegisterHimselfSchema) ,
  studentRegisterHimselfLimiter, 
  AuthController.studentRegistersHimself 
);

authRoutes.post('/login/student',
  validate(loginAsStudentSchema),
  loginLimiter,
  AuthController.loginAsStudent 
);

authRoutes.post('/login/generic',
  validate(loginAsGenericSchema),
  loginLimiter,
  AuthController.loginAsGeneric 
);

export default authRoutes;