import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import dayjs from "dayjs";
import { useState, useEffect } from "react";
import './BookingUser.scss';
import { BookingModel } from "../../components/Model/Model";
import { useNavigate } from "react-router-dom";
export default function BookingBusiness() {
   const navigate = useNavigate();

   const [isModalVisible, setIsModalVisible] = useState(false);
   const [selectedBooking, setSelectedBooking] = useState([]);
   const [selectedCell, setSelectedCell] = useState(null);
   const [user, setUser] = useState([]);

   const location = useLocation();
   const sanBong = location.state || {}; // Nhận dữ liệu từ state

   const handleClick = (date, time) => {
      console.log(`Bạn đã click vào ngày ${date} lúc ${time}`);
      setSelectedBooking({ date, time });
      setSelectedCell(`${date}-${time}`); // Lưu ô được chọn
      setIsModalVisible(true); // Mở modal
   };

   const handleCancel = () => {
      setSelectedCell(null)
      setIsModalVisible(false); // Đóng modal
   };

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const userData = params.get("user");

      if (token && userData) {
         try {
            // 🛠 Parse userData trước khi lưu
            const parsedUser = JSON.parse(userData);

            // ✅ Lưu vào localStorage
            localStorage.setItem("token", token);
            localStorage.setItem("user", JSON.stringify(parsedUser));

            setUser(parsedUser);

            navigate("/User", { replace: true });
         } catch (error) {
            console.error("Lỗi parse userData:", error);
         }
      } else {
         const storedUser = localStorage.getItem("user");
         if (storedUser) {
            try {
               setUser(JSON.parse(storedUser));
            } catch (error) {
               console.error("Lỗi khi parse user từ localStorage:", error);
            }
         }
      }
   }, [navigate]);

   // HIEN THI NGAY THANG THU TRONG TUAN
   const getMonday = (date) => {
      let d = new Date(date);
      let day = d.getDay(); // Lấy thứ trong tuần (0: Chủ nhật, 1: Thứ 2, ..., 6: Thứ 7)
      let diff = day === 0 ? -6 : 1 - day; // Nếu Chủ nhật (0) thì lùi về Thứ 2 (-6), ngược lại lùi về đúng Thứ 2
      d.setDate(d.getDate() + diff);
      return d;
   };

   const convertWeekday = (weekday) => {
      const mapping = {
         "Thứ Hai": "Thứ 2",
         "Thứ Ba": "Thứ 3",
         "Thứ Tư": "Thứ 4",
         "Thứ Năm": "Thứ 5",
         "Thứ Sáu": "Thứ 6",
         "Thứ Bảy": "Thứ 7",
         "Chủ Nhật": "CN",
      };
      return mapping[weekday] || weekday;
   };

   const generateWeekDays = () => {
      let startMonday = getMonday(new Date());
      let days = [];

      for (let i = 0; i < 7; i++) {
         let date = new Date(startMonday);
         date.setDate(startMonday.getDate() + i);
         days.push({
            date: date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }).replace(/\./g, "/"),
            dayOfWeek: convertWeekday(date.toLocaleDateString("vi-VN", { weekday: "long" }))
         });
      }

      return days;
   };

   const weekDays = generateWeekDays();
   // console.log(weekDays);

   // HIEN THI H

   const generateTimeSlots = () => {
      let times = [];
      let startTime = dayjs().hour(5).minute(0).second(0); // Bắt đầu từ 5:00 sáng
      let endTime = dayjs().hour(23).minute(30); // Dừng tại 23:30

      while (startTime.isBefore(endTime)) {
         times.push(startTime.format("HH:mm"));
         startTime = startTime.add(30, "minute");
      }

      return times;
   };

   const timeSlots = generateTimeSlots();
   // console.log(timeSlots);

   const bookings = [
      { date: "24/03", timeStart: "07:00", timeEnd: "08:00" },
      { date: "25/03", timeStart: "09:30", timeEnd: "10:30" },
      { date: "26/03", timeStart: "15:00", timeEnd: "16:00" }
   ];

   const parseTimeToMinutes = (time) => {
      const [hours, minutes] = time.split(":").map(Number);
      return hours * 60 + minutes;
   };

   const bookingData = {
      user: user, // Dữ liệu người dùng đã lưu
      football: sanBong, // Thông tin sân bóng
      date: selectedBooking.date,
      time: selectedBooking.time,
   };

   return (
      <>
         <Header />
         <div className="booking-container">
            <h4>Lịch đặt sân của sân bóng {sanBong.name}</h4>
            <div className="calendar-container">
               {/* Cột ngày + thứ */}
               <div className="date-column">
                  {weekDays.map((day, index) => (
                     <div key={index} className="date-slot">
                        <strong>{day.dayOfWeek}</strong>
                        <br />
                        {day.date}
                     </div>
                  ))}
               </div>

               <div className="main-calendar">
                  {/* Hàng ngang hiển thị giờ */}
                  <div className="time-header">
                     {timeSlots.map((time, index) => (
                        <div key={index} className="time-slot">{time}</div>
                     ))}
                  </div>
                  {/* Nội dung lịch đặt sân */}
                  <div className="calendar-container">
                     <div className="header-row">
                        <div className="corner-box"></div> {/* Ô trống góc trái */}
                     </div>
                     {timeSlots.map((time, timeIndex) => {
                        const timeInMinutes = parseTimeToMinutes(time);

                        return (
                           <div key={timeIndex} className="time-row">
                              {weekDays.map((day, dayIndex) => {
                                 const bookingInfo = bookings.find(
                                    (b) =>
                                       b.date === day.date &&
                                       timeInMinutes >= parseTimeToMinutes(b.timeStart) &&
                                       timeInMinutes < parseTimeToMinutes(b.timeEnd)
                                 );

                                 return (
                                    <div
                                       key={dayIndex}
                                       className={`content-booking ${bookingInfo ? "booked" : ""} ${selectedCell === `${day.date}-${time}` ? "selected" : ""}`}
                                       onClick={() => handleClick(day.date, time)}
                                    >
                                       {bookingInfo ? `${bookingInfo.timeStart} - ${bookingInfo.timeEnd}` : ""}
                                    </div>
                                 );
                              })}
                           </div>
                        );
                     })}
                     <BookingModel
                        isModalOpen={isModalVisible}
                        handleCancel={handleCancel}
                        bookingData={bookingData}
                     />
                  </div>
               </div>
            </div>
         </div >
      </>
   );
}
