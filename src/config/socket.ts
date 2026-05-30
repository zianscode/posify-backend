import { Server as HttpServer } from "http";
import { Server as SocketIOServer, Socket } from "socket.io";

let io: SocketIOServer | null = null;

export const initSocket = (server: HttpServer): SocketIOServer => {
  io = new SocketIOServer(server, {
    cors: {
      origin: "*", // Adjust as necessary in production
      methods: ["GET", "POST", "PUT", "DELETE"],
    },
  });

  io.on("connection", (socket: Socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join outlet room for outlet-specific broadcasts
    socket.on("join-outlet", (outletId: string | number) => {
      socket.join(`outlet:${outletId}`);
      console.log(`🔌 Socket ${socket.id} joined outlet:${outletId}`);
    });

    socket.on("disconnect", () => {
      console.log(`🔌 Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io has not been initialized!");
  }
  return io;
};

// Real-time helper triggers
export const notifyStockAlert = (
  outletId: number | null,
  data: {
    productId: number;
    productName: string;
    stock: number;
    minStock: number;
  },
) => {
  if (!io) return;
  if (outletId) {
    io.to(`outlet:${outletId}`).emit("stock-alert", data);
  }
  io.emit("stock-alert", data); // broadcast globally
};

export const notifyNewTransaction = (
  outletId: number,
  data: {
    transactionId: number;
    invoiceNo: string;
    grandTotal: number;
    cashierName: string;
  },
) => {
  if (!io) return;
  io.to(`outlet:${outletId}`).emit("new-transaction", data);
  io.emit("new-transaction", data); // broadcast globally
};
