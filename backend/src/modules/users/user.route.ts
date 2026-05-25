import { Router } from 'express';
import { UserController } from './user.controller';
import { validate } from '@backend/utils/validator.util';
import { changePasswordSchema } from '@backend/schemas/newPassword.schema';

const userRoutes = Router();

userRoutes.get( '/:role/:id/me' , UserController.getUserBasicInfos );

userRoutes.get( '/manager-list/active-students'  , UserController.getActiveStudentsToManagerList   );
userRoutes.get( '/manager-list/active-professors', UserController.getActiveProfessorsToManagerList );
userRoutes.get( '/manager-list/active-managers'  , UserController.getActiveManagersToManagerList   );

userRoutes.get( '/student/:id/general-infos'  , UserController.getStudentGeneralInfos   );
userRoutes.get( '/professor/:id/general-infos', UserController.getProfessorGeneralInfos );
userRoutes.get( '/manager/:id/general-infos'  , UserController.getManagerGeneralInfos   );

userRoutes.get('/manager-brief-infos'       , UserController.getManagerBriefInfos );
userRoutes.get('/student-brief-infos/:id'   , UserController.getStudentBriefInfos );
userRoutes.get('/professor-brief-infos/:id' , UserController.getProfessorBriefInfos );

userRoutes.post( '/exclude' , UserController.excludeUsers );
userRoutes.patch(
  '/:id/change-temporary-password', 
  validate(changePasswordSchema),
  UserController.changeUserTemporaryPassword
);
userRoutes.get('/student/:id/last-appointment' , UserController.getStudentLastAppointment );

export default userRoutes;