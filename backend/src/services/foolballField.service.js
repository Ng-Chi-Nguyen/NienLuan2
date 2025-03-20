import { sql } from '../config/connect.js';

let createFoolballFieldService = async (FFData) => {
   const { name, size, price, images, status, address, idBusiness } = FFData;
   
   try {
      if (!FFData || !idBusiness) {
         return { success: false, error: "Dữ liệu không hợp lệ!" };
      }

      // Kiểm tra doanh nghiệp có tồn tại không
      let { data: businessExists, error: businessError } = await sql
         .from("Business")
         .select("id")
         .eq("id", idBusiness)
         .single();

      if (!businessExists || businessError) {
         return { success: false, error: "Doanh nghiệp không tồn tại!" };
      }

      // Kiểm tra trùng tên sân bóng
      let { data: footballFieldExists } = await sql
         .from("FoolbalField")
         .select("id")
         .eq("idBusiness", idBusiness)
         .eq("name", name)
         .single();

      if (footballFieldExists) {
         return { success: false, error: "Tên sân bóng đã tồn tại!" };
      }

      // ✅ Fix lỗi địa chỉ
      const parsedAddress = typeof address === "string" ? JSON.parse(address) : address;
      const formattedAddress = `{${parsedAddress.map(addr => `"${addr}"`).join(",")}}`;

      let newField = {
         name,
         size,
         price,
         image: `{${images.map(img => `"${img}"`).join(",")}}`, // ✅ Lưu mảng ảnh vào PostgreSQL
         status,
         address: formattedAddress, // ✅ Định dạng địa chỉ đúng kiểu ARRAY PostgreSQL
         idBusiness,
      };

      let { data: insertedField, error: insertError } = await sql
         .from("FoolbalField")
         .insert([newField])
         .select()
         .single();

      if (insertError) {
         console.error("Lỗi khi tạo sân bóng:", insertError);
         return { success: false, error: "Lỗi khi tạo sân bóng!" };
      }

      return { success: true, message: "Tạo sân bóng thành công!", data: insertedField };

   } catch (e) {
      console.log(e);
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