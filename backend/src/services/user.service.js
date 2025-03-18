import { sql } from '../config/connect.js';
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY;
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

let updateUserService = async (id, userData) => {
   try {
      if (!id || !userData) {
         return { success: false, error: "Dữ liệu không hợp lệ!" };
      }

      const { name, email, phone, gender, address } = userData;

      const { data, error } = await sql
         .from("User")
         .update({ name, email, phone, gender, address })
         .eq("id", id)
         .select("*")
         .single();

      if (error) {
         console.error("Lỗi cập nhật user trong DB:", error);
         return { success: false, error: error.message };
      }

      if (!data || data.length === 0) {
         return { success: false, error: "Không tìm thấy người dùng để cập nhật!" };
      }

      // Tạo lại token mới
      const newToken = jwt.sign(
         { id, email, type: "user" },
         SECRET_KEY,
         { expiresIn: "7d" }
      );
      // console.log(userData)
      return {
         success: true,
         data: userData,
         token: newToken,
      };

   } catch (err) {
      console.error("Lỗi server khi cập nhật user:", err);
      return { success: false, error: "Lỗi server" };
   }
};




export { createUserService, updateUserService };


