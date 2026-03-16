import { Router } from "express";

import authRoutes from "./auth.routes";
import studentRoutes from "./student.routes";
import userRoutes from "./user.routes";
import professorsRoutes from './professors.route';

const router = Router();

router.use("/auth"       , authRoutes);
router.use("/students"   , studentRoutes);
router.use("/professors" , professorsRoutes);
router.use("/users"      , userRoutes);

export default router;