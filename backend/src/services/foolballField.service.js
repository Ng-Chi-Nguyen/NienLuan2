import { sql } from '../config/connect.js';

let createFoolballFieldService = async (fieldData) => {
   // console.log("Dữ liệu nhận được trong service:", fieldData);

   try {
      const { name, size, price, status, idProvince, idDistrict, idWard, address, idBusiness, images } = fieldData;

      // Kiểm tra dữ liệu đầu vào
      if (!name || !size || !price || status == null || !address || !idBusiness || !images || images.length === 0) {
         return { success: false, error: "Thiếu thông tin cần thiết!" };
      }

      // Kiểm tra nếu có trường bóng đá với cùng địa chỉ hoặc tên đã tồn tại
      const { data: existingFields, error: existingFieldsError } = await sql
         .from('FoolbalField')
         .select('id')
         .eq("name", name);

      if (existingFieldsError) {
         console.error("❌ Lỗi khi kiểm tra trường bóng đá:", existingFieldsError);
         return { success: false, error: existingFieldsError.message };
      }

      // Nếu trường bóng đá đã tồn tại với tên hoặc địa chỉ tương tự
      if (existingFields.length > 0) {
         return { success: false, error: "Trường bóng đá đã tồn tại!" };
      }

      // Tạo trường bóng đá mới
      const { data, error } = await sql
         .from('FoolbalField')
         .insert([
            {
               name,
               size,
               price,
               status,
               idProvince,
               idDistrict,
               idWard,
               address,
               idBusiness,
               image: images,  // Chuyển đổi mảng thành chuỗi JSON nếu cột là text
            }
         ])
         .select('*')
         .single()

      if (error) {
         console.error("❌ Lỗi insert vào Supabase:", error);
         return { success: false, error: error.message };
      }

      return { success: true, data };
   } catch (e) {
      console.error("❌ Lỗi hệ thống:", e);
      return { success: false, error: "Lỗi hệ thống!" };
   }
};
let displayFoolbalField = async (idBusiness) => {
   try {
      if (!idBusiness) {
         return { success: false, error: "Thiếu idBusiness!" };
      }
      const { data, error } = await sql
         .from('FoolbalField')
         .select("*")
         .eq("idBusiness", idBusiness)

      if (error) {
         return { success: false, message: error.message }
      }
      return {
         success: true,
         data: data
      }
   } catch (e) {
      console.log(e)
   }
}

let updateFootballFieldService = async (id, updateData) => {
   try {
      // console.log("🔹 Dữ liệu nhận để cập nhật:", updateData);

      // Lấy dữ liệu cũ trước khi cập nhật
      const { data: currentData, error: fetchError } = await sql
         .from("FoolbalField")
         .select("*")
         .eq("id", id)
         .single();

      if (fetchError) return { success: false, error: "Không tìm thấy sân bóng!" };

      // Xóa các trường không có trong DB
      delete updateData.created_at;  // Giữ nguyên ngày tạo
      delete updateData.key;         // Xóa 'key' vì không có trong bảng

      const updatedData = { ...currentData, ...updateData };

      // Cập nhật dữ liệu
      const { data: updatedField, error: updateError } = await sql
         .from("FoolbalField")
         .update(updatedData)
         .eq("id", id)
         .select("*")
         .single();

      if (updateError) return { success: false, error: updateError.message };

      return { success: true, data: updatedField };
   } catch (e) {
      console.error("❌ Lỗi hệ thống:", e);
      return { success: false, error: "Lỗi hệ thống!" };
   }
};

const deleteFootballFieldService = async (idFF) => {
   try {
      const { error, count } = await sql
         .from("FoolbalField")
         .delete()
         .eq("id", idFF);

      if (error) {
         return {
            success: false,
            message: "Lỗi khi xóa sân bóng: " + error.message,
         };
      }

      if (count === 0) {
         return {
            success: false,
            message: "Không tìm thấy sân bóng để xóa",
         };
      }

      return {
         success: true,
         message: "Xóa sân bóng thành công",
      };
   } catch (e) {
      return {
         success: false,
         message: "Lỗi hệ thống: " + e.message,
      };
   }
};



export { createFoolballFieldService, displayFoolbalField, updateFootballFieldService, deleteFootballFieldService }