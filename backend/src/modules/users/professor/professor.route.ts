import { Router } from "express";
import { ProfessorController } from "./professor.controller";

const professorRoutes = Router();

professorRoutes.post( '/:id/new-availability', ProfessorController.defineNewAvailability );
professorRoutes.get( '/availability'         , ProfessorController.getAvailability       );

export default professorRoutes;
