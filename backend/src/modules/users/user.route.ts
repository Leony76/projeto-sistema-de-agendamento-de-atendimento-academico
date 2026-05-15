import { Router } from 'express';
import { UserController } from './user.controller';

const userRoutes = Router();

userRoutes.get( '/manager-list/active-students'  , UserController.getActiveStudentsToManagerList   );
userRoutes.get( '/manager-list/active-professors', UserController.getActiveProfessorsToManagerList );
userRoutes.get( '/manager-list/active-managers'  , UserController.getActiveManagersToManagerList   );

export default userRoutes;