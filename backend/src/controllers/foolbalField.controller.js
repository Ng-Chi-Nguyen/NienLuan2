import {
   createFoolballFieldService,
   displayFoolbalField,
   updateFootballFieldService,
   deleteFootballFieldService
} from "../services/foolballField.service.js";

export const createFoolballField = async (req, res) => {
   // console.log("🔍 Dữ liệu nhận được từ client:", req.body);
   // console.log("🔍 Files nhận được từ client:", req.files);

   const requestData = req.body;

   // Kiểm tra địa chỉ
   if (!requestData.address) {
      return res.status(400).json({ error: "Địa chỉ không hợp lệ!" });
   }

   try {
      const { name, size, price, status, idProvince, idDistrict, idWard, address, idBusiness } = requestData;

      // Kiểm tra các trường dữ liệu
      if (!name || !size || !price || status == null || !address || !idBusiness) {
         return res.status(400).json({
            error: "Thiếu thông tin cần thiết!",
            data: { name, size, price, status, address, idBusiness },
         });
      }

      // Lấy các tệp ảnh và tạo danh sách đường dẫn
      const images = req.files ? req.files.map(file => `/image/uploads/${file.filename}`) : [];

      // Gọi service để lưu vào database
      const result = await createFoolballFieldService({
         name,
         size,
         price,
         images,
         idProvince,
         idDistrict,
         idWard,
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


export const updateFootballField = async (req, res) => {
   try {
      // console.log("🔹 Request body:", req.body);
      const { id } = req.params;

      if (!id) {
         return res.status(400).json({ error: "Thiếu ID sân bóng!" });
      }

      const result = await updateFootballFieldService(id, req.body);

      if (!result.success) {
         return res.status(500).json({ error: result.error });
      }

      return res.json({
         success: true,
         message: "Cập nhật thành công!"
      });
   } catch (e) {
      console.error("❌ Lỗi cập nhật sân bóng:", e);
      res.status(500).json({ error: "Lỗi hệ thống!" });
   }
};

export const deleteFootballField = async (req, res) => {
   let { id } = req.params;

   if (!id) {
      return res.json({ success: false, message: "Không tìm thấy ID sân bóng" });
   }

   try {
      let result = await deleteFootballFieldService(id);

      if (!result.success) {
         return res.json({
            success: false, // Thêm success: false khi lỗi
            message: result.message
         });
      }

      return res.json({
         success: true, // Đảm bảo có success: true khi xóa thành công
         message: "Xóa thành công",
         data: result.data
      });

   } catch (e) {
      console.error("Lỗi khi xóa sân bóng:", e);
      return res.status(500).json({
         success: false,
         message: "Lỗi hệ thống, không thể xóa sân bóng"
      });
   }
};
