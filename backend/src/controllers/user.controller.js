import { createUserService } from '../services/user.service.js';

export const createUser = async (req, res) => {
   try {
      const { name, email, password, phone, gender, address } = req.body;

      if (!name || !email || !password || !phone || gender === undefined || address === undefined) {
         return res.status(400).json({ error: "Thiếu thông tin cần thiết!" });
      }
      // console.log("📌 Dữ liệu insert:", { name, email, password, phone, gender, address });

      const result = await createUserService({ name, email, password, phone, gender, address });

      res.json({
         message: 'User created success!',
         data: result.data,
      });

   } catch (err) {
      console.error("❌ Lỗi server:", err);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};
