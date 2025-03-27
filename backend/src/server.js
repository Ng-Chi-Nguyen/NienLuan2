import express from 'express';
import session from "express-session";
import passport from "./config/passport.js";
import viewEngine from './config/viewEngine.js';
import { connectDB } from "./config/connect.js"
import Routers from './routes/index.routes.js';
import dotenv from 'dotenv';
import cors from 'cors';
import path from "path";

dotenv.config();


const app = express();


app.use(cors());
// Middleware để đọc dữ liệu từ form HTML
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT || 8081;
const hostname = process.env.HOST_NAME;

connectDB();  // Gọi hàm kết nối database

// Middleware quan trọng để đọc JSON
app.use(express.json()); // Cái này rất quan trọng!

// Cấu hình template engine
viewEngine(app);



app.use(session({
   secret: "secret",
   resave: false,
   saveUninitialized: false, // Đổi từ `true` → `false` để tránh lưu session không cần thiết
   cookie: { secure: false } // Nếu dùng HTTPS, đổi `false` thành `true`
}));
app.use(passport.initialize());
app.use(passport.session());

Routers(app)

// Cấu hình Express để phục vụ ảnh tĩnh
app.use("/image", express.static(path.join(process.cwd(), "public/image")));

app.listen(port, hostname, () => {
   console.log(`Example app listening on port ${port}`);
});
