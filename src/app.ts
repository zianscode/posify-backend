import express from "express";
import cors from "cors";
import { createServer } from "http";
import { env } from "./config/env";
import { initSocket } from "./config/socket";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";
import { sendSuccess } from "./shared/response";
import { prisma } from "./config/database";

import authRouter from "./modules/auth/auth.routes";
import categoryRouter from "./modules/category/category.routes";
import unitRouter from "./modules/unit/unit.routes";
import productRouter from "./modules/product/product.routes";
import paymentMethodRouter from "./modules/payment-method/payment-method.routes";
import stockRouter from "./modules/stock/stock.routes";
import transactionRouter from "./modules/transaction/transaction.routes";
import dashboardRouter from "./modules/dashboard/dashboard.routes";
import addOnRouter from "./modules/addon/addon.routes";
import userRouter from "./modules/user/user.routes";
import settingRouter from "./modules/setting/setting.routes";
import reportRouter from "./modules/report/report.routes";

const app = express();
const server = createServer(app);

// Initialize Socket.io
initSocket(server);

// Enable CORS
app.use(
  cors({
    origin: "*", // Adjust as necessary in production
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  }),
);

// Body Parsers
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global Request Logger
app.use(loggerMiddleware);

// Health Check Endpoint (Verifies DB connection as well)
app.get("/health", async (req, res, next) => {
  try {
    await prisma.$queryRaw`SELECT 1`;
    sendSuccess({
      res,
      message: "Server POSify dalam kondisi sehat dan terhubung ke database",
      data: {
        uptime: process.uptime(),
        timestamp: new Date(),
        database: "connected",
      },
    });
  } catch (error) {
    next(error);
  }
});

// Root API Endpoint
app.get("/api/v1", (req, res) => {
  sendSuccess({
    res,
    message: "Selamat datang di POSify API v1",
  });
});

// Register routers
app.use("/api/v1/auth", authRouter);
app.use("/api/v1/categories", categoryRouter);
app.use("/api/v1/units", unitRouter);
app.use("/api/v1/products", productRouter);
app.use("/api/v1/payment-methods", paymentMethodRouter);
app.use("/api/v1/stock", stockRouter);
app.use("/api/v1/transactions", transactionRouter);
app.use("/api/v1/dashboard", dashboardRouter);
app.use("/api/v1/add-ons", addOnRouter);
app.use("/api/v1/users", userRouter);
app.use("/api/v1/settings", settingRouter);
app.use("/api/v1/reports", reportRouter);

// Error handling middleware
app.use(errorMiddleware);

// Start the server
const PORT = env.PORT;
server.listen(PORT, () => {
  console.log(
    `🚀 POSify Backend berjalan dalam mode [${env.NODE_ENV}] pada port ${PORT}`,
  );
});

export { app, server };
