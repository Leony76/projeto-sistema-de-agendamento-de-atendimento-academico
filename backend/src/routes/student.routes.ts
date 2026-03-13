import { Router } from "express";
import { StudentController } from "../controllers/student.controller";

const router = Router();

router.get('/list'                 , StudentController.list);
router.get('/registered-today-list', StudentController.registeredTodayList);
router.put('/update/:ra'           , StudentController.edit);
router.put('/remove/:ra'           , StudentController.remove);

export default router;