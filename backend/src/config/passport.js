import passport from "passport";
import { Strategy as GoogleStrategy } from "passport-google-oauth20";
import dotenv from "dotenv";

dotenv.config(); // Load biến môi trường từ file .env

passport.use(
   new GoogleStrategy(
      {
         clientID: process.env.GG_CLIENT_ID,
         clientSecret: process.env.GG_CLIENT_SECRET,
         callbackURL: process.env.callbackURL,
         passReqToCallback: true,
      },
      async (req, accessToken, refreshToken, profile, done) => {
         return done(null, profile);
      }
   )
);


passport.serializeUser((user, done) => {
   done(null, user.id);
});

passport.deserializeUser((id, done) => {
   done(null, { id });
});

export default passport;