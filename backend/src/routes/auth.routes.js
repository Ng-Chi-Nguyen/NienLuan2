import express from 'express';
import { loginUser, googleAuth, googleCallback } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter
   .post('/login', loginUser)
   .get("/google", googleAuth) // Bắt đầu xác thực với Google, Gọi Passport để bắt đầu quá trình đăng nhập.
   .get("/google/callback", googleCallback); // Xử lý sau khi Google xác thực

export default authRouter;
