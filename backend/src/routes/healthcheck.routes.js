import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { healthcheck } from "../controllers/healthcheck.controller.js";

const router = Router();

router.route("/health-check").get(verifyToken, healthcheck);

export default router;
