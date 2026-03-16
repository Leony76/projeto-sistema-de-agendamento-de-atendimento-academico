import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/autorize.middleware";
import { ProfessorController } from "../controllers/professor.controller";

const router = Router();

router.use(authenticate);

router.get('/list'                 , authorize(['MANAGER']), ProfessorController.list);
router.get('/registered-today-list', authorize(['MANAGER']), ProfessorController.registeredTodayList);
router.put('/update/:ra'           , authorize(['MANAGER']), ProfessorController.edit);
router.put('/remove/:ra'           , authorize(['MANAGER']), ProfessorController.remove);

export default router;