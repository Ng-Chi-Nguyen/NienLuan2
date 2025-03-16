import express from 'express';
import passport from '../config/passport.js'; // Đảm bảo đã import passport
import { loginUser, googleAuth, googleCallback } from '../controllers/auth.controller.js';

const authRouter = express.Router();

authRouter
   .post('/login', loginUser)
   .get("/google", googleAuth)
   .get("/google/callback", googleCallback);

export default authRouter;
