import { Router } from 'express';
import authRoutes from '../modules/auth/auth.route';
import disciplineRoutes from '@backend/modules/disciplines/discipline.route';
import userRoutes from '@backend/modules/users/user.route';

const routes = Router();

routes.use('/auth'       , authRoutes       );
routes.use('/discipline' , disciplineRoutes );
routes.use('/user'       , userRoutes       );

export default routes;