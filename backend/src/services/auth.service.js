import { sql } from '../config/connect.js';
import jwt from 'jsonwebtoken';
import { v4 as uuidv4 } from 'uuid';

const SECRET_KEY = process.env.SECRET_KEY;

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
      let additionalInfo = {}; // Dữ liệu bổ sung cho doanh nghiệp

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

         // Thêm thông tin cho tài khoản doanh nghiệp
         additionalInfo = {
            owner_name: user.owner_name,
            license_number: user.license_number,
            tax_code: user.tax_code,
            established_date: user.established_date,
         };
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

      // Tạo object kết quả trả về
      let responseUser = {
         id: user.id,
         name: user.name,
         email: user.email,
         phone: user.phone,
         address: user.address,
         created_at: user.created_at,
         type: userType, // Gửi thông tin loại tài khoản
         ...additionalInfo, // Thêm thông tin nếu là doanh nghiệp
      };

      // Nếu là tài khoản User, thì thêm gender
      if (userType === "user") {
         responseUser.gender = user.gender;
      }

      return {
         success: true,
         message: "Đăng nhập thành công!",
         token,
         user: responseUser,
      };
   } catch (e) {
      console.log(e);
      return { success: false, error: "Lỗi hệ thống!" };
   }
};

// ✅ Hàm tạo token JWT
let generateToken = (user) => {
   return jwt.sign(
      { id: user.id, email: user.email, type: "user" },
      SECRET_KEY,
      { expiresIn: "7d" }
   );
};
// ✅ Hàm xử lý login với Google
let handleGoogleLogin = async (googleUser) => {
   const { email, name, picture } = googleUser;

   try {
      let { data: existingUser, error } = await sql
         .from("User")
         .select("*")
         .eq("email", email)
         .single();

      if (error || !existingUser) {
         // Nếu chưa có tài khoản, tạo tài khoản mới
         let newUser = {
            UID: uuidv4(),
            name: name,
            email: email,
            avatar_url: picture,
            created_at: new Date(),
         };

         let { data: insertedUser, error: insertError } = await sql
            .from("User")
            .insert([newUser])
            .select()
            .single();

         if (insertError) {
            console.error("Lỗi khi tạo tài khoản:", insertError);
            return { success: false, error: "Lỗi khi tạo tài khoản" };
         }

         existingUser = insertedUser;
      }

      // ✅ Tạo token sau khi đăng nhập thành công
      const token = generateToken(existingUser);
      return { success: true, token, user: existingUser };

   } catch (e) {
      console.error("Lỗi hệ thống:", e);
      return { success: false, error: "Lỗi hệ thống" };
   }
};
export { loginUserService, handleGoogleLogin };
