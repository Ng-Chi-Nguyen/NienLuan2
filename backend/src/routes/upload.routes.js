import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import { fileURLToPath } from "url";
import { uploadImage } from "../controllers/upload.controller.js";

// ✅ Xử lý `__dirname` cho ES Module
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadRouter = express.Router();

// ✅ Kiểm tra và tạo thư mục nếu chưa tồn tại
const uploadDir = path.join(__dirname, "../../public/image/uploads");
if (!fs.existsSync(uploadDir)) {
   fs.mkdirSync(uploadDir, { recursive: true });
}

// ✅ Cấu hình Multer để lưu file
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, uploadDir);
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Đặt tên file tránh trùng
   },
});

const upload = multer({ storage });

uploadRouter.post("/", upload.single("image"), uploadImage);

export default uploadRouter;
