import { Router } from "express";

import authRoutes from "./auth.routes";
import studentRoutes from "./student.routes";
import userRoutes from "./user.routes";

const router = Router();

router.use("/auth"    , authRoutes);
router.use("/students", studentRoutes);
router.use("/users"   , userRoutes);

export default router;