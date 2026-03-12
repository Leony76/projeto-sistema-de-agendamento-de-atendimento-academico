import { Router } from "express";
import { authenticateToken } from "../middleware/auth.middleware";
import { UserController } from "../controllers/user.controller";

const router = Router();

router.get("/me", authenticateToken, UserController.me);

export default router;