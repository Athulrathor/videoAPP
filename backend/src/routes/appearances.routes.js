import { Router } from "express";
import { verifyToken } from "../middlewares/auth.middleware.js";
import { getSettings, setSettings } from "../controllers/appearances.controller.js";


const router = Router();

router.route("/setAppearance").post(verifyToken, setSettings);

router.route("/getAppearance").get(verifyToken, getSettings);

export default router;
