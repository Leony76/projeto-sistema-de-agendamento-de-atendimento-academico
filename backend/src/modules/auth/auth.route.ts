import { Router } from 'express';
import { AuthController } from './auth.controller';

const authRoutes = Router();

authRoutes.post( '/register/student' , AuthController.selfStudentRegistration );
authRoutes.post( '/login/student'    , AuthController.loginAsStudent );

export default authRoutes;