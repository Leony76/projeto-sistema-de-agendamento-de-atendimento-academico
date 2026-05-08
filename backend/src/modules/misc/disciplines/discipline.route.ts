import { Router } from 'express';
import { DisciplineController } from './discipline.controller';

const disciplineRoutes = Router();

disciplineRoutes.get( '/get-names'         , DisciplineController.getNames );
disciplineRoutes.get( '/get-unbound-names' , DisciplineController.getUnboundNames );

export default disciplineRoutes;