import { Router } from "express";
import { StudentController } from "../controllers/student.controller";
import { authenticate } from "../middleware/auth.middleware";
import { authorize } from "../middleware/autorize.middleware";

const router = Router();

router.use(authenticate);

router.get('/list'                 , authorize(['MANAGER']), StudentController.list);
router.get('/registered-today-list', authorize(['MANAGER']), StudentController.registeredTodayList);
router.put('/update/:id'           , authorize(['MANAGER']), StudentController.edit);
router.put('/remove/:id'           , authorize(['MANAGER']), StudentController.remove);

export default router;