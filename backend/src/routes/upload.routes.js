import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { uploadImage } from "../controllers/upload.controller.js";
import { multerConfig } from '../config/uploadFile.js'; // Import multerConfig


const uploadRouter = express.Router();

// Kiểm tra và tạo thư mục nếu chưa tồn tại
const upload = multerConfig;


uploadRouter.post("/", upload.array("images", 10), uploadImage);


export default uploadRouter;
