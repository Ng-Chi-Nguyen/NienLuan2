import express from "express";
import { multerConfig } from '../config/uploadFile.js'; // Import multerConfig

import {
   createFoolballField,
   getAllFoolbalFieldById,
   updateFootballField,
   deleteFootballField,
   getAllFoolbalField,
   updateFootballFieldImage,
   displayFootballFieldImage
} from "../controllers/foolbalField.controller.js";

// Dùng trực tiếp `multerConfig`
const upload = multerConfig;

const foolbalFieldRouter = express.Router();

foolbalFieldRouter
   .post("/", upload.array("images", 5), createFoolballField) // Nhận tối đa 5 ảnh
   .get("/", getAllFoolbalField)
   .get("/:id", getAllFoolbalFieldById)
   .post("/:id", updateFootballField)
   .delete("/:id", deleteFootballField)
   .post("/:id/images", upload.array("images", 5), updateFootballFieldImage)
   .get("/:id/images", displayFootballFieldImage);

export default foolbalFieldRouter;
