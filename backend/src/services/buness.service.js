import { sql } from '../config/connect.js';

let createBusinessService = async (businessData) => {
   const { name, email, password, phone, address } = businessData;

   try {
      // Kiểm tra email và số điện thoại trong bảng Users
      let { data: userExists } = await sql
         .from("User")
         .select("id")
         .or(`email.eq.${email},phone.eq.${phone}`);

      // Kiểm tra email và số điện thoại trong bảng Businesses
      let { data: businessExists } = await sql
         .from("Business")
         .select("id")
         .or(`email.eq.${email},phone.eq.${phone}`);

      // Nếu email/số điện thoại đã tồn tại, không cho phép tạo tài khoản
      if (userExists.length > 0 || businessExists.length > 0) {
         return { success: false, error: "Email hoặc số điện thoại đã được sử dụng!" };
      }

      // Tạo tài khoản doanh nghiệp
      const { data, error } = await sql
         .from("Businesses")
         .insert([{ name, email, password, phone, address }])
         .select("*");

      if (error) {
         console.error("❌ Lỗi insert vào Supabase:", error);
         return { success: false, error };
      }

      return { success: true, data };
   } catch (e) {
      console.log(e);
      return { success: false, error: "Lỗi hệ thống!" };
   }
};


export { createBusinessService };
