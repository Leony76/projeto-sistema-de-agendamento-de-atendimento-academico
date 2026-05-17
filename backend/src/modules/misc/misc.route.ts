import { Router } from "express";
import { MiscController } from "./misc.controller";

const miscRoutes = Router();

miscRoutes.get('/system-reports'            , MiscController.getSystemReports     );

export default miscRoutes;