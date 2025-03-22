import { sql } from '../config/connect.js';

let createFoolballFieldService = async (fieldData) => {
   console.log("Dữ liệu nhận được trong service:", fieldData);

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

export { createFoolballFieldService, displayFoolbalField }