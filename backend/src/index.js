import dotenv from "dotenv";

dotenv.config({ path: "./.env" });

import connectDb from "./db/mongoose.js";
import app from "./app.js";
import http from "http";
import { Server } from "socket.io";

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: "http://localhost:5173" || process.env.FRONTH_END_URL,
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
    server.listen(process.env.PORT || 8000, () => {
        console.log(`Server is running on PORT: ${process.env.PORT}`);
    })
}).catch((err) => {
    console.log("Error in connection failed db index.js",err)
})