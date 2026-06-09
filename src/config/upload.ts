import multer from "multer";
import path from "path";
import fs from "fs";

const UPLOADS_DIR = path.resolve(process.cwd(), "uploads");
const PRODUCTS_DIR = path.join(UPLOADS_DIR, "products");
const AVATARS_DIR = path.join(UPLOADS_DIR, "avatars");

if (!fs.existsSync(PRODUCTS_DIR)) {
  fs.mkdirSync(PRODUCTS_DIR, { recursive: true });
}
if (!fs.existsSync(AVATARS_DIR)) {
  fs.mkdirSync(AVATARS_DIR, { recursive: true });
}

const storage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, PRODUCTS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

const fileFilter = (
  _req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = ["image/jpeg", "image/png", "image/webp", "image/gif"];
  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Hanya file gambar (JPEG, PNG, WebP, GIF) yang diizinkan"));
  }
};

export const uploadProductImage = multer({
  storage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("image");

const avatarStorage = multer.diskStorage({
  destination: (_req, _file, cb) => {
    cb(null, AVATARS_DIR);
  },
  filename: (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const name = `avatar-${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, name);
  },
});

export const uploadAvatar = multer({
  storage: avatarStorage,
  fileFilter,
  limits: { fileSize: 2 * 1024 * 1024 },
}).single("avatar");

export function deleteImage(filename: string) {
  const filePath = path.join(PRODUCTS_DIR, path.basename(filename));
  if (fs.existsSync(filePath)) {
    fs.unlinkSync(filePath);
  }
}
