import { sql } from '../config/connect.js';

let createBookingService = async (bookingData) => {
   const { id_User, id_FF, date, timeStart, timeEnd, price, userType } = bookingData;

   if (!id_User || !id_FF || !date || !timeStart || !timeEnd || !price || !userType) {
      return {
         success: false,
         message: "Thiếu thông tin"
      };
   }

   try {
      let userExists = null;
      let insertData = { id_FF, date, timeStart, timeEnd, price, userType };

      if (userType === "user") {
         // Kiểm tra người dùng trong bảng User
         const { data } = await sql
            .from("User")
            .select("id")
            .eq("id", id_User)
            .single();
         userExists = data;
         if (userExists) insertData.id_User = id_User;
      } else if (userType === "business") {
         // Kiểm tra doanh nghiệp trong bảng Business
         const { data } = await sql
            .from("Business")
            .select("id")
            .eq("id", id_User)
            .single();
         userExists = data;
         if (userExists) insertData.id_Business = id_User;
      }
      // console.log(userExists)

      if (!userExists) {
         return {
            success: false,
            message: "Người dùng không tồn tại"
         };
      }

      // Kiểm tra sân bóng có tồn tại không
      const { data: fieldExists } = await sql
         .from("FoolbalField")
         .select("id")
         .eq("id", id_FF)
         .single();
      if (!fieldExists) {
         return {
            success: false,
            message: "Sân bóng không tồn tại"
         };
      }

      // Thêm vào bảng Booking
      const { data, error } = await sql
         .from("Booking")
         .insert(insertData)
         .select("*")
         .single();

      if (error) {
         return {
            success: false,
            message: "Lỗi server: " + error.message
         };
      }

      return {
         success: true,
         message: "Tạo thành công",
         data
      };

   } catch (e) {
      return {
         success: false,
         message: "Lỗi hệ thống: " + e.message
      };
   }
};

export { createBookingService };
