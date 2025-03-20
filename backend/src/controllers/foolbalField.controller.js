import { createFoolballFieldService, displayFoolbalField } from "../services/foolballField.service.js";

export const createFoolbalField = async (req, res) => {
   console.log("🔍 Giá trị address nhận được:", req.body.address);

   try {
      const { name, size, price, status, address, idBusiness } = req.body;

      // Kiểm tra nếu không có file nào được tải lên
      if (!req.files || req.files.length === 0) {
         return res.status(400).json({ error: "Vui lòng tải lên ít nhất 1 hình ảnh!" });
      }

      // Lưu đường dẫn ảnh vào mảng images
      const images = req.files.map(file => `/image/uploads/${file.filename}`);

      // Kiểm tra dữ liệu đầu vào
      if (!name || !size || !price || images.length === 0 || status === undefined || !address || !idBusiness) {
         return res.status(400).json({
            error: "Thiếu thông tin cần thiết!",
            data: { name, size, price, images, status, address, idBusiness },
         });
      }

      // Lưu vào database
      const result = await createFoolballFieldService({
         name,
         size,
         price,
         images,
         status,
         address,
         idBusiness,
      });

      if (!result.success) {
         return res.status(500).json({ error: result.error });
      }

      res.json({ success: result.success, message: result.message, data: result.data });

   } catch (e) {
      console.error("❌ Lỗi server:", e);
      res.status(500).json({ error: "Lỗi hệ thống!" });
   }
};




export const getAllFoolbalField = async (req, res) => {
   try {
      let { id } = req.params;
      let idBusiness = Number(id);

      // console.log("idBusiness sau khi parse:", idBusiness);
      if (!idBusiness) {
         return res.json({ success: false, message: "Không thấy id doanh nghhiep" })
      }
      const result = await displayFoolbalField(idBusiness);

      if (!result.success) {
         return res.json({ result })
      }
      return res.status(200).json(result);
   } catch (e) {
      console.log(e)
   }
}