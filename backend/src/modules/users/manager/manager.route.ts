import { Router } from 'express';
import { ManagerController } from './manager.controller';

const managerRoutes = Router();

managerRoutes.post( '/register-new-user' , ManagerController.registerNewUser );

export default managerRoutes;