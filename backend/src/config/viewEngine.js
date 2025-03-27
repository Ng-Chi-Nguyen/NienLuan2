import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const viewEngine = (app) => {
   app.set('views', path.join(__dirname, '../views'));
   app.set('view engine', 'ejs');

   // Phục vụ file tĩnh
   app.use(express.static(path.join(__dirname, '../public')));
   
   app.use("/image/uploads", express.static(path.join(process.cwd(), "src/public/image/uploads")));


   app.use('/bootstrap', express.static(path.join(__dirname, '../../node_modules/bootstrap/dist')));
   app.use('/jquery', express.static(path.join(__dirname, '../../node_modules/jquery/dist')));

   app.get("/favicon.ico", (req, res) => res.status(204).end()); // Ngăn chặn lỗi favicon.ico
};

export default viewEngine;
