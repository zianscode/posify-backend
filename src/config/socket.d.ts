import { Server as HttpServer } from "http";
import { Server as SocketIOServer } from "socket.io";
export declare const initSocket: (server: HttpServer) => SocketIOServer;
export declare const getIO: () => SocketIOServer;
export declare const notifyStockAlert: (outletId: number | null, data: {
    productId: number;
    productName: string;
    stock: number;
    minStock: number;
}) => void;
export declare const notifyNewTransaction: (outletId: number, data: {
    transactionId: number;
    invoiceNo: string;
    grandTotal: number;
    cashierName: string;
}) => void;
//# sourceMappingURL=socket.d.ts.map