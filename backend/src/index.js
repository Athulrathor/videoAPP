import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import connectDb from "./db/mongoose.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";
import { port, socketCorsOrigin } from "./config/env.js";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: socketCorsOrigin,
        credentials: true,
    },
});

global.io = io;

io.on("connection", (socket) => {
    console.log("User connected:", socket.id);

    socket.on("join-room", ({ room }) => {
        socket.join(room);
    });

    socket.on("disconnect", () => {
        console.log("User disconnected");
    });
});

connectDb().then(() => {
    server.listen(port, () => {
        console.log(`Server is running on PORT: ${port}`);
    })
}).catch((err) => {
    console.log("Error in connection failed db index.js",err)
})
