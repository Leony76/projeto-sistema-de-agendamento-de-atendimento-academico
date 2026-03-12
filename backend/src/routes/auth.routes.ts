import { Router } from "express";
import { AuthController } from "../controllers/auth.controller";

const router = Router();

router.post('/login/student'   , AuthController.loginAsStudent);
router.post('/login/manager'   , AuthController.loginAsManager);
router.post('/register/student', AuthController.registerAsStudent);
router.post('/register/manager', AuthController.registerAsManager);

export default router;