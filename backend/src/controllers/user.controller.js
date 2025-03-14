import { createUserService } from '../services/user.service.js';

export const createUser = async (req, res) => {
   try {
      const { name, email, password, phone, gender } = req.body;

      if (!name || !email || !password || !phone || gender === undefined) {
         return res.status(400).json({ error: "Thiếu thông tin cần thiết!" });
      }

      const result = await createUserService({ name, email, password, phone, gender });

      if (!result || !result.success) { // Kiểm tra null hoặc undefined
         return res.status(500).json({ error: result?.error || 'Lỗi khi tạo user!' });
      }

      res.json({
         message: 'User created successfully!',
         data: result.data,
      });

   } catch (err) {
      console.error("❌ Lỗi server:", err);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};
