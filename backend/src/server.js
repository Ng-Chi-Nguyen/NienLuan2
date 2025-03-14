import express from 'express';
import viewEngine from './config/viewEngine.js';
import { connectDB } from "./config/connect.js"
import Routers from './routes/index.routes.js';
import dotenv from 'dotenv';
import cors from 'cors';


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

Routers(app)



app.listen(port, hostname, () => {
   console.log(`Example app listening on port ${port}`);
});
