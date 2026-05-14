import { Router } from 'express';
import { AuthController } from './auth.controller';

const authRoutes = Router();

authRoutes.post( '/manager/register/student'   , AuthController.managerRegistersStudent );
// authRoutes.post( '/manager/register/professor' , AuthController.managerRegistersProfessor );
// authRoutes.post( '/manager/register/manager'   , AuthController.managerRegistersManager );
authRoutes.post( '/register/student'           , AuthController.studentRegistersHimself );
authRoutes.post( '/login/student'              , AuthController.loginAsStudent );
authRoutes.post( '/login/generic'              , AuthController.loginAsGeneric );

export default authRoutes;