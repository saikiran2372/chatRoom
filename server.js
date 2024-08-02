import express from 'express';
import http from 'http';
import { Server } from 'socket.io';
import cors from 'cors';

export const app = express();
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
    cors: {
        origin: '*',
        methods: ["GET", "POST"]
    }
});

io.on("connection", (socket) => {
    console.log("Connection made.");

    // Handle user joining a room
    socket.on("join", ({ username, room }) => {
        socket.join(room);
        socket.username = username;
        io.to(room).emit("userJoined", `${username} has joined the room.`);
    });

    // Handle sending messages
    socket.on("sendMessage", ({ message, room }) => {
        const userMessage = {
            username: socket.username,
            message: message
        };
        io.to(room).emit('message', userMessage);
    });

    // Handle user disconnecting
    socket.on("disconnect", () => {
        console.log("Connection is disconnected");
    });
});

server.listen(3000, () => {
    console.log("Server is listening on port 3000");
});
