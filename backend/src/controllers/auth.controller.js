import { loginUserService } from "../services/auth.service.js";
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
      if (!user) return res.redirect("http://localhost:3000/Login");

      const { email, name, picture } = user._json; // Lấy dữ liệu từ Google

      try {
         let { data: existingUser, error } = await sql
            .from("User")
            .select("*")
            .eq("email", email)
            .single();

         if (error || !existingUser) {
            // Nếu chưa có tài khoản, tạo tài khoản mới với dữ liệu từ Google
            let newUser = {
               UID: uuidv4(),
               name: name,
               email: email,
               avatar_url: picture,
               created_at: new Date(),
            };

            let { data: insertedUser, error: insertError } = await sql
               .from("User")
               .insert([newUser])
               .select()
               .single();

            if (insertError) {
               console.error("Lỗi khi tạo tài khoản:", insertError);
               return res.redirect("http://localhost:3000/Login?error=signup_failed");
            }

            existingUser = insertedUser;
         }

         // ✅ Sử dụng generateToken để tạo token
         const token = generateToken(existingUser);

         // Gửi token về frontend để đăng nhập
         res.redirect(`http://localhost:3000/User?token=${token}`);
      } catch (e) {
         console.error("Lỗi hệ thống:", e);
         return res.redirect("http://localhost:3000/Login?error=server_error");
      }
   })(req, res, next);
};
