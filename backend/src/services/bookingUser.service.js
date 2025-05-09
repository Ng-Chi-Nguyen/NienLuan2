import { sql } from '../config/connect.js';
import dayjs from 'dayjs';
import utc from 'dayjs/plugin/utc.js';
import timezone from 'dayjs/plugin/timezone.js';

let createBookingService = async (bookingData) => {

   // Kích hoạt các plugin
   dayjs.extend(utc);
   dayjs.extend(timezone);

   const { id_User, id_FF, date, timeStart, timeEnd, price, userType, id_Business, id_Business_BK } = bookingData;

   if (!id_User || !id_FF || !date || !timeStart || !timeEnd || !price || !userType || !id_Business) {
      return {
         success: false,
         message: "Thiếu thông tin"
      };
   }

   try {
      let userExists = null;
      let insertData = { id_FF, date, timeStart, timeEnd, price, userType, id_Business, id_Business_BK };

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

      // Lấy thời gian hiện tại tại Việt Nam
      const vietnamTime = dayjs().tz('Asia/Ho_Chi_Minh');  // Lấy thời gian hiện tại ở Việt Nam
      const bookingDate = dayjs(date).tz('Asia/Ho_Chi_Minh');  // Chuyển đổi ngày đặt sân sang múi giờ Việt Nam
      const bookingTimeStart = dayjs(`${date} ${timeStart}`).tz('Asia/Ho_Chi_Minh'); // Chuyển đổi thời gian bắt đầu đặt sân, sẽ là thời điểm hiện tại tại Việt Nam (có giờ, phút, giây đầy đủ)

      // Kiểm tra xem ngày đặt sân có phải là hôm nay hoặc ngày trong tương lai không
      if (bookingDate.isBefore(vietnamTime, 'day')) {
         // .isBefore() dùng để so sánh
         return {
            success: false,
            message: "Không thể đặt sân cho ngày hôm qua hoặc trước đó!"
         };
      }

      // Kiểm tra xem giờ đặt sân có trước giờ hiện tại không
      if (bookingTimeStart.isBefore(vietnamTime, 'minute')) {
         return {
            success: false,
            message: "Không thể đặt sân vào giờ trong quá khứ!"
         };
      }
      // Kiểm tra và in ra thời gian sau khi chuyển đổi
      // console.log('Thời gian hiện tại tại Việt Nam:', vietnamTime.format()); // In ra thời gian ở Việt Nam
      // console.log("Ngày đặt sân:", bookingDate.format());

      // **Kiểm tra xem khung giờ đã có ai đặt chưa**
      const { data: existingBookings } = await sql
         .from("Booking")
         .select("id, timeStart, timeEnd")
         .eq("id_FF", id_FF)
         .eq("date", date);

      // Hàm chuyển thời gian sang phút
      const toMinutes = (time) => {
         const [hours, minutes] = time.split(":").map(Number);
         // Ví dụ: "08:30" sẽ chuyển thành 8 * 60 + 30 = 510 phút
         return hours * 60 + minutes;
      };

      const isConflict = existingBookings.some((booking) => {
         const bookingStart = toMinutes(booking.timeStart);
         const bookingEnd = toMinutes(booking.timeEnd);
         const newStart = toMinutes(timeStart);
         const newEnd = toMinutes(timeEnd);

         // console.log(`Booking đã có: ${bookingStart} - ${bookingEnd}`);
         // console.log(`Booking mới: ${newStart} - ${newEnd}`);

         return (
            (newStart >= bookingStart && newStart < bookingEnd) ||  // Thời gian BD nằm trong một khoảng đã đặt
            (newEnd > bookingStart && newEnd <= bookingEnd) ||      // Kết thúc trong khoảng đã đặt
            (newStart <= bookingStart && newEnd >= bookingEnd)      // Bao trùm toàn bộ khung giờ đã đặt
         );
      });
      if (isConflict) {
         return {
            success: false,
            message: `Giờ mà bạn đã có người đặt rồi 😞! Chọn giờ khác nhé`
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
         message: "Cám ơn bạn đã đặt sân của tôi! Nhớ ra sân đúng giờ nhé!",
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
            .order("date", { ascending: false });
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
      } else if (type === "business") {
         const { data, error } = await sql
            .from("Booking")
            .select("*")
            .eq("id_Business_BK", idUser)
            .order("date", { ascending: false });
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

let getBookingsForTodayByBusiness = async (id_Business) => {
   dayjs.extend(utc);
   dayjs.extend(timezone);
   try {

      // Lấy thời gian hiện tại tại Việt Nam
      const todayStart = dayjs().tz('Asia/Ho_Chi_Minh').startOf('day').format();
      const todayEnd = dayjs().tz('Asia/Ho_Chi_Minh').endOf('day').format();

      // Truy vấn tất cả các lịch đặt sân của doanh nghiệp trong ngày hôm nay
      const { data, error } = await sql
         .from('Booking')
         .select('*')
         .eq('id_Business', id_Business)
         .gte('date', todayStart)
         .lte('date', todayEnd)
         .order('timeStart', { ascending: true }); // Sắp xếp theo timeStart

      if (error) {
         throw new Error(error.message);
      }

      return {
         success: true,
         message: "Lấy lịch đặt sân thành công!",
         data
      };
   } catch (e) {
      return {
         success: false,
         message: "Lỗi hệ thống: " + e.message
      };
   }
};

let deleteBookingService = async (id) => {
   try {
      const { check, errorCheck } = await sql
         .from("Booking")
         .select("id")
         .eq("id", id)

      if (errorCheck) {
         return {
            success: false,
            message: error
         }
      }
      const { error, count } = await sql
         .from("Booking")
         .delete()
         .eq("id", id)

      if (error) {
         return {
            success: false,
            message: "Lỗi khi xóa lịch đặt sân: " + error.message,
         };
      }

      if (count === 0) {
         return {
            success: false,
            message: "Không tìm thấy lịch bạn đặt để xóa",
         };
      }

      return {
         success: true,
         message: "Xóa lịch đặt sân thành công",
      };

   } catch (e) {
      console.log(e)
      return {
         success: false,
         message: e
      }
   }
}

export {
   createBookingService,
   displayBokingService,
   displayBokingInfoUserService,
   getBookingsForTodayByBusiness,
   deleteBookingService
};
