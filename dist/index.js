"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_1 = __importDefault(require("http"));
const socket_io_1 = require("socket.io");
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_1 = require("./db");
const authRouter_1 = __importDefault(require("./authRouter"));
const dotenv_1 = __importDefault(require("dotenv"));
const errorhandllingMiddleware_1 = __importDefault(require("./errorhandllingMiddleware"));
;
dotenv_1.default.config();
const app = (0, express_1.default)();
const server = http_1.default.createServer(app);
const io = new socket_io_1.Server(server, { cors: { origin: "" } });
app.use(express_1.default.json());
app.use((0, cookie_parser_1.default)());
app.use("/api/v1", authRouter_1.default);
app.use(errorhandllingMiddleware_1.default);
db_1.AppDataSource.initialize()
    .then(() => console.log("database connected"))
    .catch((err) => console.log("dayabase connection error", err));
io.on("connection", (socket) => {
    console.log("New client connected:", socket.id);
    socket.on("sendMessage", (data) => {
        io.emit("receiveMessage", data);
    });
    socket.on("joinRoom", (room) => {
        socket.join(room);
        console.log(`User joined room: ${room}`);
    });
    socket.on("leaveRoom", (room) => {
        socket.leave(room);
        console.log(`User left room: ${room}`);
    });
    socket.on("disconnect", () => console.log("Client disconnected"));
});
const PORT = 5000;
server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
