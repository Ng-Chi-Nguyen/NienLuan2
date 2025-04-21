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

      // Kiểm tra số điện thoại đã được sử dụng trong bảng User (ngoại trừ user hiện tại)
      const { data: phoneInUser, error: errorUser } = await sql
         .from("User")
         .select("id")
         .eq("phone", phone)
         .neq("id", id)
         .maybeSingle();

      if (errorUser) {
         console.error("Lỗi kiểm tra số điện thoại trong User:", errorUser);
         return { success: false, error: "Lỗi khi kiểm tra số điện thoại (User)!" };
      }

      // Kiểm tra số điện thoại đã được sử dụng trong bảng Business
      const { data: phoneInBusiness, error: errorBusiness } = await sql
         .from("Business")
         .select("id")
         .eq("phone", phone)
         .maybeSingle();

      if (errorBusiness) {
         console.error("Lỗi kiểm tra số điện thoại trong Business:", errorBusiness);
         return { success: false, error: "Lỗi khi kiểm tra số điện thoại (Business)!" };
      }

      if (phoneInUser || phoneInBusiness) {
         return { success: false, message: "Số điện thoại đã được sử dụng bởi người dùng khác!" };
      }

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


let displayUserService = async (id) => {
   try {
      if (!id) {
         return { success: false, error: "Thiếu id!" };
      }
      const { data, error } = await sql
         .from('User')
         .select("*")
         .eq("id", id)

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

export { createUserService, updateUserService, displayUserService };


