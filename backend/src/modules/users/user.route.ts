import { Router } from 'express';
import { UserController } from './user.controller';
import { validate } from '@backend/utils/validator.util';
import { changePasswordSchema } from '@backend/schemas/newPassword.schema';

const userRoutes = Router();

userRoutes.get( '/me' , UserController.getUserBasicInfos );

userRoutes.get( '/manager-list/active-student'   , UserController.getActiveStudentsToManagerList   );
userRoutes.get( '/manager-list/active-professor' , UserController.getActiveProfessorsToManagerList );
userRoutes.get( '/manager-list/active-manager'   , UserController.getActiveManagersToManagerList   );

userRoutes.get( '/student/:id/general-infos'  , UserController.getStudentGeneralInfos   );
userRoutes.get( '/professor/:id/general-infos', UserController.getProfessorGeneralInfos );
userRoutes.get( '/manager/:id/general-infos'  , UserController.getManagerGeneralInfos   );

userRoutes.get('/user-brief-infos' , UserController.getUserBriefInfos );

userRoutes.post( '/exclude' , UserController.excludeUsers );

userRoutes.patch(
  '/change-temporary-password', 
  validate(changePasswordSchema),
  UserController.changeUserTemporaryPassword
);

userRoutes.get('/student/last-appointment' , UserController.getStudentLastAppointment );

export default userRoutes;