import express from "express";
import { getAllShorts,getAllVideos } from "../controllers/common.controller.js";
const router = express.Router();

router.route("/get-all-videos").get( getAllVideos);

router.route("/get-all-shorts").get(getAllShorts);

export default router;

