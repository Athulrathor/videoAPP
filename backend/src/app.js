import express from "express";
import cookieParser from "cookie-parser";
import cors from "cors";
const corsOption = {
  origin: [`${process.env.FRONTH_END_URL}`],
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH"],
};

const app = express();

app.set('trust proxy', true);

app.use(express.json());
app.use(
  express.urlencoded({ limit: "50mb", extended: true, parameterLimit: 50000 })
);
app.use(express.static("public"));
app.use(cors(corsOption));
app.use(cookieParser());

import userRouter from "./routes/user.routes.js";
import videoRouter from "./routes/video.routes.js";
import shortRouter from "./routes/short.routes.js";
import tweetRouter from "./routes/tweet.routes.js";
import playlistRouter from "./routes/playlist.routes.js";
import likeRouter from "./routes/like.routes.js";
import commentRouter from "./routes/comment.routes.js";
import subcriberRouter from "./routes/subcription.routes.js";
import dashboardRouter from "./routes/dashboard.routes.js";
import healthcheckRouter from "./routes/healthcheck.routes.js";
import commonRouter from "./routes/common.routes.js";

app.use("/api/v1/users", userRouter);

app.use("/api/v1/videos", videoRouter);

app.use("/api/v1/short", shortRouter);

app.use("/api/v1/tweets", tweetRouter);

app.use("/api/v1/playlist", playlistRouter);

app.use("/api/v1/like", likeRouter);

app.use("/api/v1/comment", commentRouter);

app.use("/api/v1/subcriber", subcriberRouter);

app.use("/api/v1/dashboard", dashboardRouter);

app.use("/api/v1/health", healthcheckRouter);

app.use("/api/v1/commons", commonRouter);
 
export default app;