import { Router } from 'express';
import authRoutes from '../modules/auth/auth.route';
import disciplineRoutes from '@backend/modules/misc/disciplines/discipline.route';
import managerRoutes from '@backend/modules/users/manager/manager.route';

const routes = Router();

routes.use('/auth'       , authRoutes       );
routes.use('/discipline' , disciplineRoutes );
routes.use('/manager'    , managerRoutes    );

export default routes;