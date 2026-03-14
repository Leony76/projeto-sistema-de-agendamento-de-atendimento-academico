import { Router } from "express";
import { authenticate } from "../middleware/auth.middleware";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.get("/me", authenticate, UserController.me);

export default router;