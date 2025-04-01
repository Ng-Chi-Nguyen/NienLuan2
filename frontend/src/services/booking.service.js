import axios from "axios";
import dayjs from "dayjs";

// Dặt sân
export const createBooking = async (data) => {
   try {
      const response = await axios.post("/api/bookingUser/", data, {
         headers: {
            "Content-Type": "application/json",
         },
      });
      return response.data; // Trả về dữ liệu nhận được
   } catch (e) {
      console.error("❌ Lỗi khi gửi dữ liệu:", e);
      throw e; // Ném lỗi để component xử lý
   }
};

// Lấy danh sách booking của user
export const getBookingsByUser = async (userId, userType) => {
   if (!userId || !userType) return [];
   try {
      let response = await axios.get(`/api/bookingUser/userInfo/${userId}?type=${userType}`);
      if (response.data.success) {
         return response.data.data.map(booking => ({
            ...booking,
            date: dayjs(booking.date).format("DD-MM"),
            timeStart: booking.timeStart.slice(0, 5),
            timeEnd: booking.timeEnd.slice(0, 5),
         }));
      } else {
         console.log("Lỗi từ API:", response.data.message);
      }
   } catch (e) {
      console.error("Lỗi khi lấy danh sách booking:", e);
   }
   return [];
};
// Hiện lịch đặt sân bóng của danh nghiệp hôm nay
export const getBookingsForTodayByBusiness = async (id_Business) => {
   if (!id_Business) return;
   try {
      let response = await axios.get(`/api/bookingUser/AllFootballToday/${id_Business}`);
      if (response.data.success) {
         return response.data.data.map(booking => ({
            ...booking,
            date: dayjs(booking.date).format("DD-MM"),
            timeStart: booking.timeStart.slice(0, 5),
            timeEnd: booking.timeEnd.slice(0, 5),
         }));
      } else {
         console.log("Lỗi từ API:", response.data.message);
      }
   } catch (e) {
      console.log(e)
   }
   return [];
}

export const deleteBooking = async (id) => {
   if (!id) return false
   try {
      let response = await axios.delete(`/api/bookingUser/${id}`)
      if (response.data.success) {
         return true; // Trả về true nếu xóa thành công
      } else {
         alert(`Lỗi: ${response.data.message}`);
         return false;
      }
   } catch (e) {
      console.log(e)
      return false
   }
}