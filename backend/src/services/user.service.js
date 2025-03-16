import { sql } from '../config/connect.js';

let createUserService = async (userData) => {
   const { name, email, password, phone, gender, address } = userData;

   try {
      // Kiểm tra email và số điện thoại trong bảng User
      let { data: userExists } = await sql
         .from("User")
         .select("id")
         .or(`email.eq.${email},phone.eq.${phone}`);

      // Kiểm tra email và số điện thoại trong bảng Business
      let { data: businessExists } = await sql
         .from("Business")
         .select("id")
         .or(`email.eq.${email},phone.eq.${phone}`);

      // Nếu email/số điện thoại đã tồn tại, không cho phép tạo tài khoản
      if (userExists.length > 0 || businessExists.length > 0) {
         return { success: false, error: "Email hoặc số điện thoại đã được sử dụng!" };
      }

      // Tạo tài khoản người dùng
      const { data, error } = await sql
         .from("User")
         .insert([{ name, email, password, phone, gender, address }])
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



export { createUserService };


