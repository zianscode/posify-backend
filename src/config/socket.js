"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notifyNewTransaction = exports.notifyStockAlert = exports.getIO = exports.initSocket = void 0;
const socket_io_1 = require("socket.io");
let io = null;
const initSocket = (server) => {
    io = new socket_io_1.Server(server, {
        cors: {
            origin: "*", // Adjust as necessary in production
            methods: ["GET", "POST", "PUT", "DELETE"],
        },
    });
    io.on("connection", (socket) => {
        console.log(`🔌 Client connected: ${socket.id}`);
        // Join outlet room for outlet-specific broadcasts
        socket.on("join-outlet", (outletId) => {
            socket.join(`outlet:${outletId}`);
            console.log(`🔌 Socket ${socket.id} joined outlet:${outletId}`);
        });
        socket.on("disconnect", () => {
            console.log(`🔌 Client disconnected: ${socket.id}`);
        });
    });
    return io;
};
exports.initSocket = initSocket;
const getIO = () => {
    if (!io) {
        throw new Error("Socket.io has not been initialized!");
    }
    return io;
};
exports.getIO = getIO;
// Real-time helper triggers
const notifyStockAlert = (outletId, data) => {
    if (!io)
        return;
    if (outletId) {
        io.to(`outlet:${outletId}`).emit("stock-alert", data);
    }
    else {
        io.emit("stock-alert", data);
    }
};
exports.notifyStockAlert = notifyStockAlert;
const notifyNewTransaction = (outletId, data) => {
    if (!io)
        return;
    io.to(`outlet:${outletId}`).emit("new-transaction", data);
};
exports.notifyNewTransaction = notifyNewTransaction;
//# sourceMappingURL=socket.js.map