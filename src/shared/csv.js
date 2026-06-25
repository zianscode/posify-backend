"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.toCSV = void 0;
const toCSV = (headers, rows) => {
    const headerLine = headers.map(escapeCSV).join(",");
    const dataLines = rows.map((row) => row.map((cell) => escapeCSV(String(cell ?? ""))).join(","));
    return [headerLine, ...dataLines].join("\r\n");
};
exports.toCSV = toCSV;
const escapeCSV = (value) => {
    if (value.includes(",") || value.includes('"') || value.includes("\n") || value.includes("\r")) {
        return `"${value.replace(/"/g, '""')}"`;
    }
    return value;
};
//# sourceMappingURL=csv.js.map