import multer from 'multer';
import { fileURLToPath } from 'url';
import path from 'path';

// Tạo __dirname thủ công
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
// console.log(__dirname)
// Đường dẫn thư mục upload
const uploadDir = path.join(__dirname, '..', 'public', 'image', 'uploads');

// Cấu hình Multer
const storage = multer.diskStorage({
   destination: (req, file, cb) => {
      cb(null, uploadDir);
   },
   filename: (req, file, cb) => {
      const timestamp = Date.now();
      const extension = path.extname(file.originalname);
      const fileName = `${timestamp}${extension}`;
      cb(null, fileName);
   },
});

// Khởi tạo Multer với cấu hình
const multerConfig = multer({
   storage,
   limits: { fileSize: 10 * 1024 * 1024 }, // Giới hạn 10MB
   fileFilter: (req, file, cb) => {
      const allowedTypes = /jpeg|jpg|png|gif/;
      const extname = allowedTypes.test(path.extname(file.originalname).toLowerCase());
      const mimetype = allowedTypes.test(file.mimetype);
      if (extname && mimetype) {
         return cb(null, true);
      } else {
         cb(new Error('Chỉ hỗ trợ ảnh JPG, JPEG, PNG, GIF'));
      }
   }
});

export { uploadDir, multerConfig };
