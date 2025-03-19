import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config(); // Load biến môi trường từ file .env

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

// Lưu user vào session
passport.serializeUser((user, done) => {
   done(null, user.id);
});

// Tải user từ session
passport.deserializeUser((id, done) => {
   done(null, { id });
});

export default passport;