import { sql } from '../config/connect.js';

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

      console.log("Kết quả insert:", data, error);
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
