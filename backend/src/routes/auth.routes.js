import express from 'express';
import { loginUser, googleAuth, googleCallback, facebookAuth, facebookCallback } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter
   .post('/login', loginUser)
   .get("/google", googleAuth) // Bắt đầu xác thực với Google, Gọi Passport để bắt đầu quá trình đăng nhập.
   .get("/google/callback", googleCallback) // Xử lý sau khi Google xác thực

   .get("/facebook", facebookAuth) // Bắt đầu xác thực với Facebook
   .get("/facebook/callback", facebookCallback) // Xử lý sau khi Facebook xác thực

export default authRouter;
