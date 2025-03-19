import { sql } from '../config/connect.js';

let createFoolballFieldService = async (FFData) => {
   const { name, size, price, image, status, address, idBusiness } = FFData;
   try {
      if (!FFData || !idBusiness) {
         return { success: false, error: "Dữ liệu không hợp lệ!" };
      }
      // console.log("ID Business:", FFData.idBusiness, typeof FFData.idBusiness);

      // Kiểm tra idBusiness có tồn tại trong bảng Business k
      let { data: businessExists, error: businessError } = await sql
         .from("Business")
         .select("id")
         .eq("id", idBusiness)
         .single();

      if (!businessExists || businessError) {
         return { success: false, error: "Doanh nghiệp không tồn tại!" };
      }

      // Kiểm tra xem trong cùng một doanh nghiệp đã có sân bóng cùng tên chưa
      let { data: footballFieldExists, error } = await sql
         .from("FootbalField")
         .select("id")
         .eq("idBusiness", idBusiness)
         .eq("name", name)
         .single();

      if (footballFieldExists) {
         return { success: false, error: "Tên sân bóng đã tồn tại trong doanh nghiệp của bạn!" };
      }

      let newField = {
         name, size, price,
         image: Array.isArray(image) ? image : [image],  // Chuyển thành mảng nếu chưa phải mảng, 
         status, address, idBusiness
      }

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
}

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