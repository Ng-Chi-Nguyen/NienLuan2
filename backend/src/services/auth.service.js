import { sql } from '../config/connect.js';
import jwt from 'jsonwebtoken';

const SECRET_KEY = process.env.SECRET_KEY;

// const client = new OAuth2Client(GG_CLIENT_ID);

let loginUserService = async (userData) => {
   try {
      const { email, password } = userData;

      // Kiểm tra trong bảng Users
      let { data: user, error } = await sql
         .from("User")
         .select("*")
         .eq("email", email)
         .single();

      let userType = "user"; // Mặc định là tài khoản thường

      if (error || !user) {
         // Nếu không tìm thấy trong Users, kiểm tra Businesses
         let { data: business, error: businessError } = await sql
            .from("Business")
            .select("*")
            .eq("email", email)
            .single();

         if (businessError || !business) {
            return { success: false, error: "Tài khoản không tồn tại!" };
         }

         user = business; // Nếu tìm thấy trong Businesses, gán vào biến user
         userType = "business"; // Xác định loại tài khoản là doanh nghiệp
      }

      // Kiểm tra mật khẩu
      if (user.password !== password) {
         return { success: false, error: "Sai mật khẩu!" };
      }

      // Tạo token JWT có thêm thông tin loại tài khoản
      const token = jwt.sign(
         { id: user.id, email: user.email, type: userType },
         SECRET_KEY,
         { expiresIn: "7d" }
      );

      return {
         success: true,
         message: "Đăng nhập thành công!",
         token,
         user: {
            id: user.id,
            name: user.name,
            email: user.email,
            phone: user.phone,
            gender: user.gender,
            address: user.address,
            type: userType, // Gửi thông tin loại tài khoản
         },
      };
   } catch (e) {
      console.log(e);
      return { success: false, error: "Lỗi hệ thống!" };
   }
};


export { loginUserService };