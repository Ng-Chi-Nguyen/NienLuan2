import { sql } from '../config/connect.js';

let createBookingService = async (bookingData) => {
   const { id_User, id_FF, date, timeStart, timeEnd, price, userType, id_Business } = bookingData;

   if (!id_User || !id_FF || !date || !timeStart || !timeEnd || !price || !userType || !id_Business) {
      return {
         success: false,
         message: "Thiếu thông tin"
      };
   }

   try {
      let userExists = null;
      let insertData = { id_FF, date, timeStart, timeEnd, price, userType, id_Business };

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
         if (userExists) insertData.id_Business_BK = id_User;
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

      // **Kiểm tra xem khung giờ đã có ai đặt chưa**
      const { data: existingBookings } = await sql
         .from("Booking")
         .select("id, timeStart, timeEnd")
         .eq("id_FF", id_FF)
         .eq("date", date);

      const isConflict = existingBookings.some((booking) => {
         return (
            (timeStart >= booking.timeStart && timeStart < booking.timeEnd) || // Bắt đầu trong khoảng đã đặt
            (timeEnd > booking.timeStart && timeEnd <= booking.timeEnd) || // Kết thúc trong khoảng đã đặt
            (timeStart <= booking.timeStart && timeEnd >= booking.timeEnd) // Bao trùm toàn bộ khung giờ đã đặt
         );
      });

      if (isConflict) {
         return {
            success: false,
            message: "Khung giờ này đã có người đặt!"
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

let displayBokingService = async (idFF) => {
   // console.log(idFF)
   try {
      const { data, error } = await sql
         .from("Booking")
         .select("*")
         .eq("id_FF", idFF)

      if (error) {
         return {
            success: false,
            message: error
         }
      }
      return {
         success: true,
         data
      }
   } catch (e) {
      return {
         success: false,
         message: e
      }
   }
}

let displayBokingInfoUserService = async (idUser, type) => {
   try {
      if (type === "user") {
         const { data, error } = await sql
            .from("User")
            .select("*")
            .eq("id", idUser)
            .single()
         if (!data) {
            return {
               success: false,
               message: "Người dùng không tồn tại" + error
            }
         }
      } else if (type === "business") {
         const { data, error } = await sql
            .from("Business")
            .select("*")
            .eq("id", idUser)
            .single()
         if (!data) {
            return {
               success: false,
               message: "Người dùng không tồn tại" + error
            }
         }
      }
      if (type === "user") {
         const { data, error } = await sql
            .from("Booking")
            .select("*")
            .eq("id_User", idUser)
         if (error) {
            return {
               success: false,
               message: error
            }
         }
         console.log(data)
         return {
            success: true,
            data
         }
      } else if (type === "business") {
         const { data, error } = await sql
            .from("Booking")
            .select("*")
            .eq("id_Business_BK", idUser)
         if (error) {
            return {
               success: false,
               message: error
            }
         }
         // console.log(data)
         return {
            success: true,
            data
         }
      }
   } catch (e) {
      console.log(e)
      return {
         success: false,
         message: e
      }
   }
}

export { createBookingService, displayBokingService, displayBokingInfoUserService };
