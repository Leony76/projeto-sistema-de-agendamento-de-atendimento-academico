import { Router } from 'express';
import { DisciplineController } from './discipline.controller';

const disciplineRoutes = Router();

disciplineRoutes.get( '/names'         , DisciplineController.getNames );
disciplineRoutes.get( '/unbound-names' , DisciplineController.getUnboundNames );
disciplineRoutes.post( '/add'              , DisciplineController.add );

export default disciplineRoutes;