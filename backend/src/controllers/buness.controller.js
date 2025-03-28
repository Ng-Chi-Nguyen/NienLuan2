import { createBusinessService, updateBusinessService, displayBusinessService } from "../services/buness.service.js";

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

export const updateBusiness = async (req, res) => {
   try {
      const { id } = req.params;
      const { name, email, phone, owner_name, address } = req.body;

      if (!id) {
         return res.status(400).json({ error: "Thiếu ID người dùng!" });
      }

      const result = await updateBusinessService(id, { name, email, phone, owner_name, address });

      if (!result.success) {
         return res.status(500).json({ error: result.error });
      }
      // console.log(result)
      return res.json({
         message: "Cập nhật người doanh nghiệp thành công!",
         data: result.data,
         success: result.success,
         token: result.token, // Gửi token mới về frontend
      });

   } catch (e) {
      console.error("Lỗi hệ thống:", e);
      return res.status(500).json({ error: "Lỗi hệ thống" });
   }
}

export const displayBusiness = async (req, res) => {
   let { id } = req.params;
   // console.log(id)
   if (!id) {
      return res.json({
         success: false,
         message: `Không tìm thấy id ${id}`
      })
   }
   let result = await displayBusinessService(id)
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