import { sql } from '../config/connect.js';
import jwt from 'jsonwebtoken';
const SECRET_KEY = process.env.SECRET_KEY;

let createBusinessService = async (businessData) => {
   console.log("Dữ liệu nhận được:", businessData);


   try {
      const { name, email, password, phone, address, owner_name, license_number, tax_code, established_date } = businessData;


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

      // Tạo tài khoản doanh nghiệp
      const { data, error } = await sql
         .from("Business")
         .insert([{ name, email, password, phone, address, owner_name, license_number, tax_code, established_date }])
         .select("*");

      // console.log("Kết quả insert:", data, error);
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

let updateBusinessService = async (id, businessData) => {
   try {
      if (!id || !businessData) {
         return { success: false, error: "Dữ liệu không hợp lệ!" };
      }

      const { name, email, phone, owner_name, address } = businessData;

      const { data, error } = await sql
         .from("Business")
         .update({ name, email, phone, owner_name, address })
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
      // console.log(businessData)
      return {
         success: true,
         data: businessData,
         token: newToken,
      };

   } catch (err) {
      console.error("Lỗi server khi cập nhật user:", err);
      return { success: false, error: "Lỗi server" };
   }
}

let displayBusinessService = async (id) => {
   try {
      if (!id) {
         return { success: false, error: "Thiếu id!" };
      }
      const { data, error } = await sql
         .from('Business')
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

export { createBusinessService, updateBusinessService, displayBusinessService };
