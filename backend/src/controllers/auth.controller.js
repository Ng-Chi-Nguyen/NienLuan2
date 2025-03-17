import { loginUserService, handleGoogleLogin } from "../services/auth.service.js";
import { sql } from '../config/connect.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';
import passport from "passport";

const SECRET_KEY = process.env.SECRET_KEY;

// 🔥 Hàm tạo token JWT (DÙNG CHUNG CHO LOGIN VÀ GOOGLE LOGIN)
const generateToken = (user) => {
   return jwt.sign(
      { id: user.id, email: user.email, type: "user" },
      SECRET_KEY,
      { expiresIn: "7d" }
   );
};

export const loginUser = async (req, res) => {
   const result = await loginUserService(req.body);
   console.log("Login Service Result:", result);

   if (!result.success) {
      return res.status(400).json({ message: result.error });
   }

   const token = generateToken(result.user);
   console.log("Generated Token:", token);

   res.json({ success: true, token, user: result.user });
};

export const googleAuth = passport.authenticate("google", { scope: ["profile", "email"] });

export const googleCallback = (req, res, next) => {
   passport.authenticate("google", { session: false }, async (err, user, info) => {
      if (err) return next(err);
      if (!user) return res.redirect("http://localhost:3000/Login?error=google_failed");

      const googleUser = user._json;
      const result = await handleGoogleLogin(googleUser);

      if (!result.success) {
         return res.redirect("http://localhost:3000/Login?error=" + encodeURIComponent(result.error));
      }

      const token = generateToken(result.user);
      const userData = encodeURIComponent(JSON.stringify(result.user));

      // ✅ Chuyển hướng về `/User` với token và thông tin user
      res.redirect(`http://localhost:3000/User?token=${token}&user=${userData}`);
   })(req, res, next);
};