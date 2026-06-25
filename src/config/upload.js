"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadAvatar = exports.uploadProductImage = void 0;
exports.deleteImage = deleteImage;
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const UPLOADS_DIR = path_1.default.resolve(process.cwd(), "uploads");
const PRODUCTS_DIR = path_1.default.join(UPLOADS_DIR, "products");
const AVATARS_DIR = path_1.default.join(UPLOADS_DIR, "avatars");
if (!fs_1.default.existsSync(PRODUCTS_DIR)) {
    fs_1.default.mkdirSync(PRODUCTS_DIR, { recursive: true });
}
if (!fs_1.default.existsSync(AVATARS_DIR)) {
    fs_1.default.mkdirSync(AVATARS_DIR, { recursive: true });
}
const storage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, PRODUCTS_DIR);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, name);
    },
});
const fileFilter = (_req, file, cb) => {
    const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
    if (allowedMimes.includes(file.mimetype)) {
        cb(null, true);
    }
    else {
        cb(new Error("Hanya file gambar (JPEG, PNG, WebP, GIF) yang diizinkan"));
    }
};
exports.uploadProductImage = (0, multer_1.default)({
    storage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
}).single("image");
const avatarStorage = multer_1.default.diskStorage({
    destination: (_req, _file, cb) => {
        cb(null, AVATARS_DIR);
    },
    filename: (_req, file, cb) => {
        const ext = path_1.default.extname(file.originalname).toLowerCase();
        const name = `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
        cb(null, name);
    },
});
exports.uploadAvatar = (0, multer_1.default)({
    storage: avatarStorage,
    fileFilter,
    limits: { fileSize: 2 * 1024 * 1024 },
}).single("avatar");
function deleteImage(filename) {
    const filePath = path_1.default.join(PRODUCTS_DIR, path_1.default.basename(filename));
    if (fs_1.default.existsSync(filePath)) {
        fs_1.default.unlinkSync(filePath);
    }
}
//# sourceMappingURL=upload.js.map