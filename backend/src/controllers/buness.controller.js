import { createBusinessService } from "../services/buness.service.js";

export const createBuness = async (req, res) => {
   
   try {
      const { name, email, password, phone, address, owner_name, license_number, tax_code, established_date } = req.body;
      

      // Kiểm tra nếu có trường nào bị thiếu
      if (!name || !email || !password || !phone || !address || !owner_name || !license_number || !tax_code || established_date === undefined) {
         return res.status(400).json({ error: "Thiếu thông tin cần thiết!" });
      }

      // Gọi service để tạo business
      const result = await createBusinessService({ name, email, password, phone, address, owner_name, license_number, tax_code, established_date });

      if (!result || !result.data) {
         return res.status(500).json({ error: "Không thể tạo business, vui lòng thử lại!" });
      }

      return res.status(201).json({
         message: "Business created successfully!",
         data: result.data,
      });

   } catch (err) {
      console.error("❌ Lỗi server:", err);
      return res.status(500).json({ error: "Internal Server Error" });
   }
};
