import { Router } from 'express';
import authRoutes from '../modules/auth/auth.route';
import disciplineRoutes from '@backend/modules/discipline/discipline.route';
import userRoutes from '@backend/modules/users/user.route';
import miscRoutes from '@backend/modules/misc/misc.route';
import professorRoutes from '@backend/modules/users/professor/professor.route';
import appointmentRoutes from '@backend/modules/appointment/appointment.route';
import roomRoutes from '@backend/modules/room/room.route';
import historyRoutes from '@backend/modules/history/history.route';

const routes = Router();

routes.use('/auth'        , authRoutes        );
routes.use('/discipline'  , disciplineRoutes  );
routes.use('/user'        , userRoutes        );
routes.use('/professor'   , professorRoutes   );
routes.use('/misc'        , miscRoutes        );
routes.use('/room'        , roomRoutes        );
routes.use('/appointment' , appointmentRoutes );
routes.use('/history'     , historyRoutes     );

export default routes;