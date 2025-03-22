import express from "express";
import multer from "multer";
import path from "path";
import { createFoolballField, getAllFoolbalField } from "../controllers/foolbalField.controller.js";

const foolbalFieldRouter = express.Router();

// Cấu hình Multer để lưu file vào thư mục `public/image/uploads/`
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, "public/image/uploads/");
   },
   filename: (req, file, cb) => {
      cb(null, Date.now() + path.extname(file.originalname)); // Đổi tên file tránh trùng
   },
});

const upload = multer({ storage });

// API tạo sân bóng (hỗ trợ upload nhiều ảnh)
foolbalFieldRouter
   .post("/", upload.array("images", 5), createFoolballField)
   .get("/:id", getAllFoolbalField)

export default foolbalFieldRouter;
