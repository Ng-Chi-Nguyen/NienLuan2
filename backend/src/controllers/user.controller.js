import { createUserService, updateUserService, displayUserService } from '../services/user.service.js';

export const createUser = async (req, res) => {
   try {
      const { name, email, password, phone, gender, address } = req.body;

      if (!name || !email || !password || !phone || gender === undefined || address === undefined) {
         return res.status(400).json({ error: "Thiếu thông tin cần thiết!" });
      }
      const result = await createUserService({ name, email, password, phone, gender, address });
      if (!result.success) {
         return res.status(500).json({ error: result.error });
      }
      res.json({
         message: 'User created success!',
         data: result.data,
      });
   } catch (err) {
      console.error("❌ Lỗi server:", err);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};


export const updateUser = async (req, res) => {
   try {
      const { id } = req.params;
      const { name, email, phone, gender, address } = req.body;

      if (!id) {
         return res.status(400).json({ error: "Thiếu ID người dùng!" });
      }

      const result = await updateUserService(id, { name, email, phone, gender, address });

      if (!result.success) {
         return res.json({
            success: result.success,
            message: result.message
         });
      }
      // console.log(result)
      return res.json({
         message: "Cập nhật người dùng thành công!",
         data: result.data,
         success: result.success,
         token: result.token, // Gửi token mới về frontend
      });

   } catch (e) {
      console.error("Lỗi hệ thống:", e);
      return res.status(500).json({ error: "Lỗi hệ thống" });
   }
};

export const displayUser = async (req, res) => {
   let { id } = req.params;
   // console.log(id)
   if (!id) {
      return res.json({
         success: false,
         message: `Không tìm thấy id ${id}`
      })
   }
   let result = await displayUserService(id)
   if (!result.success) {
      return res.json({
         success: result.success,
         message: result.error
      })
   }
   return res.json({
      success: result.success,
      data: result.data
   })
}