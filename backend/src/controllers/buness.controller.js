import { createBusinessService } from "../services/buness.service.js";

export const createBuness = async (req, res) => {
   try {
      const { name, email, password, phone, address, owner_name, license_number, tax_code, established_date } = req.body;

      if (!name || !email || !password || !phone || !address || !owner_name || !license_number || !tax_code || !established_date === undefined) {
         return res.status(400).json({ error: "Thiếu thông tin cần thiết!" });
      }

      const result = await createBusinessService({ name, email, password, phone, address, owner_name, license_number, tax_code, established_date });

      res.json({
         message: 'Business created success!',
         data: result.data,
      });

   } catch (err) {
      console.error("❌ Lỗi server:", err);
      res.status(500).json({ error: 'Internal Server Error' });
   }
};