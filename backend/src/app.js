import dotenv from "dotenv";
dotenv.config({ path: "./.env" });

import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
import { corsOrigins } from "./config/env.js";

//  Routes
import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import shortRouter from "./routes/short.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";
import subcriberRouter from "./routes/subcription.routes.js";
// import dashboardRouter from "./routes/dashboard.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import commonRouter from "./routes/common.routes.js";
import appearancesRouter from "./routes/appearances.routes.js";

const corsOption = {
  origin: function (origin, callback) {
    if (!origin || corsOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

const app = express();

app.set("trust proxy", true);

// ✅ Correct order
app.use(cors(corsOption));                                                    // 1. CORS first
app.use(express.json({ limit: "50mb" }));                                    // 2. JSON parser
app.use(express.urlencoded({
  limit: "50mb", extended: true,
  parameterLimit: 50000
}));                      // 3. URL-encoded
app.use(express.static("public"));                                           // 4. Static files
app.use(cookieParser());

app.use("/api/v1/users", userRouter);
app.use("/api/v1/videos", videoRouter);
app.use("/api/v1/shorts", shortRouter);
app.use("/api/v1/tweets", tweetRouter);
app.use("/api/v1/playlists", playlistRouter);
app.use("/api/v1/likes", likeRouter);
app.use("/api/v1/comments", commentRouter);
app.use("/api/v1/subscribers", subcriberRouter);
// app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/healths", healthcheckRouter);
app.use("/api/v1/commons", commonRouter);
app.use("/api/v1/appearances", appearancesRouter);
 
export default app;
