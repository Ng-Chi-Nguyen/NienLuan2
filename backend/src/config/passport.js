import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import { Strategy as FacebookStrategy } from 'passport-facebook';
import dotenv from "dotenv";

dotenv.config(); // Load biến môi trường từ file .env

// Cấu hình Google login
passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GG_CLIENT_ID, // ID ứng dụng Google
         clientSecret: process.env.GG_CLIENT_SECRET, // Secret key của ứng dụng
         callbackURL: process.env.callbackURL, // URL Google gọi lại sau khi xác thực
         passReqToCallback: true, // Cho phép truyền req vào callback
      },
      async (req, accessToken, refreshToken, profile, done) => {
         return done(null, profile);
      }
   )
);

// Cấu hình Facebook login
passport.use(
   new FacebookStrategy(
      {
         clientID: process.env.FB_CLIENT_ID, // ID ứng dụng Facebook
         clientSecret: process.env.FB_CLIENT_SECRET, // Secret key của ứng dụng
         callbackURL: process.env.FB_CALLBACK_URL, // URL Facebook gọi lại sau khi xác thực
         profileFields: ['id', 'emails', 'name', 'picture'], // Các trường cần thiết từ Facebook
      },
      async (accessToken, refreshToken, profile, done) => {
         // Xử lý thông tin người dùng từ Facebook sau khi đăng nhập thành công
         return done(null, profile);
      }
   )
);

// Lưu user vào session
passport.serializeUser((user, done) => {
   done(null, user.id);
});

// Tải user từ session
passport.deserializeUser((id, done) => {
   done(null, { id });
});

export default passport;