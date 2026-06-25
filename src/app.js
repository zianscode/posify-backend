"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.server = exports.app = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const path_1 = __importDefault(require("path"));
const http_1 = require("http");
const env_1 = require("./config/env");
const socket_1 = require("./config/socket");
const logger_middleware_1 = require("./middlewares/logger.middleware");
const error_middleware_1 = require("./middlewares/error.middleware");
const response_1 = require("./shared/response");
const database_1 = require("./config/database");
const auth_routes_1 = __importDefault(require("./modules/auth/auth.routes"));
const category_routes_1 = __importDefault(require("./modules/category/category.routes"));
const unit_routes_1 = __importDefault(require("./modules/unit/unit.routes"));
const product_routes_1 = __importDefault(require("./modules/product/product.routes"));
const payment_method_routes_1 = __importDefault(require("./modules/payment-method/payment-method.routes"));
const stock_routes_1 = __importDefault(require("./modules/stock/stock.routes"));
const transaction_routes_1 = __importDefault(require("./modules/transaction/transaction.routes"));
const dashboard_routes_1 = __importDefault(require("./modules/dashboard/dashboard.routes"));
const addon_routes_1 = __importDefault(require("./modules/addon/addon.routes"));
const user_routes_1 = __importDefault(require("./modules/user/user.routes"));
const setting_routes_1 = __importDefault(require("./modules/setting/setting.routes"));
const report_routes_1 = __importDefault(require("./modules/report/report.routes"));
const notification_routes_1 = __importDefault(require("./modules/notification/notification.routes"));
const admin_routes_1 = __importDefault(require("./modules/admin/admin.routes"));
const app = (0, express_1.default)();
exports.app = app;
const server = (0, http_1.createServer)(app);
exports.server = server;
// Initialize Socket.io
(0, socket_1.initSocket)(server);
// Enable CORS
app.use((0, cors_1.default)({
    origin: "*", // Adjust as necessary in production
    methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
}));
// Body Parsers
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: true }));
// Serve uploaded files
app.use("/uploads", express_1.default.static(path_1.default.resolve(process.cwd(), "uploads")));
// Global Request Logger
app.use(logger_middleware_1.loggerMiddleware);
// Health Check Endpoint (Verifies DB connection as well)
app.get("/health", async (req, res, next) => {
    try {
        await database_1.prisma.$queryRaw `SELECT 1`;
        (0, response_1.sendSuccess)({
            res,
            message: "Server Warmindo dalam kondisi sehat dan terhubung ke database",
            data: {
                uptime: process.uptime(),
                timestamp: new Date(),
                database: "connected",
            },
        });
    }
    catch (error) {
        next(error);
    }
});
// Root API Endpoint
app.get("/api/v1", (req, res) => {
    (0, response_1.sendSuccess)({
        res,
        message: "Selamat datang di Warmindo API v1",
    });
});
// Register routers
app.use("/api/v1/auth", auth_routes_1.default);
app.use("/api/v1/categories", category_routes_1.default);
app.use("/api/v1/units", unit_routes_1.default);
app.use("/api/v1/products", product_routes_1.default);
app.use("/api/v1/payment-methods", payment_method_routes_1.default);
app.use("/api/v1/stock", stock_routes_1.default);
app.use("/api/v1/transactions", transaction_routes_1.default);
app.use("/api/v1/dashboard", dashboard_routes_1.default);
app.use("/api/v1/add-ons", addon_routes_1.default);
app.use("/api/v1/users", user_routes_1.default);
app.use("/api/v1/settings", setting_routes_1.default);
app.use("/api/v1/reports", report_routes_1.default);
app.use("/api/v1/notifications", notification_routes_1.default);
app.use("/api/v1/admin", admin_routes_1.default);
// Error handling middleware
app.use(error_middleware_1.errorMiddleware);
// Start the server
const PORT = env_1.env.PORT;
server.listen(PORT, () => {
    console.log(`🚀 Warmindo Backend berjalan dalam mode [${env_1.env.NODE_ENV}] pada port ${PORT}`);
});
//# sourceMappingURL=app.js.map