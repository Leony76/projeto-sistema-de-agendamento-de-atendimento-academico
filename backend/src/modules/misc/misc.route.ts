import { Router } from "express";
import { MiscController } from "./misc.controller";

const miscRoutes = Router();

miscRoutes.get('/system-reports'        , MiscController.getSystemReports     );
miscRoutes.get('/manager-brief-infos'   , MiscController.getManagerBriefInfos );
miscRoutes.get('/student-brief-infos/:id'   , MiscController.getStudentBriefInfos );
miscRoutes.get('/professor-brief-infos/:id' , MiscController.getProfessorBriefInfos );

export default miscRoutes;