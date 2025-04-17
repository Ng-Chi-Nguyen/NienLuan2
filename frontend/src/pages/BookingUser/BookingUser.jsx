import { useLocation } from "react-router-dom";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import ContentBooking from "./Content/contentBooking";
import { getBusinessById } from "../../services/business.service";
import dayjs from "dayjs";
import { useState, useEffect, useMemo } from "react";
import './BookingUser.scss';
import { BookingModel } from "../../components/Model/Booking/BookingModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
export default function BookingBusiness() {
   const navigate = useNavigate();
   const [isModalVisible, setIsModalVisible] = useState(false);
   const [selectedBooking, setSelectedBooking] = useState([]); // Lưu ngày và giờ người dùng chọn
   const [selectedCell, setSelectedCell] = useState(null); // Lưu ô lịch được chọn
   const [user, setUser] = useState([]);
   const [business, setBusiness] = useState([]);
   const [bookings, setBookings] = useState([]);
   const [currentWeekOffset, setCurrentWeekOffset] = useState(0); // Dịch tuần (tuần hiện tại là 0, tuần sau là +1, tuần trước là -1)

   const location = useLocation(); // Dùng để lấy thông tin về route hiện tại
   const sanBong = location.state || {}; // Nhận dữ liệu từ state
   // console.log("user", user)
   const checkLogin = () => {
      const userStored = localStorage.getItem("user");
      return !!userStored; // trả về true nếu đã login
   };
   useEffect(() => {
      const fetchBusinessInfo = async () => {
         try {
            const data = await getBusinessById(sanBong.idBusiness);
            setBusiness(data); // Cập nhật thông tin doanh nghiệp
         } catch (e) {
            console.log(e)
         }
      };

      if (sanBong.idBusiness) {
         fetchBusinessInfo();
      }
   }, [sanBong.idBusiness]);
   // console.log(business[0].phone)
   const handleClick = (date, time) => {
      if (!checkLogin()) {
         navigate("/Login", { state: { messageBooking: `Bạn không muốn đang nhập thì liên hệ ${business[0].phone} để đặt sân giúp nhé! Cám ơn bạn nhiều 😍` } });
         return;
      }
      // console.log(`Bạn đã click vào ngày ${date} lúc ${time}`);
      setSelectedBooking({ date, time });
      setSelectedCell(`${date}-${time}`); // Lưu ô được chọn
      setIsModalVisible(true); // Mở modal
   };

   const handleCancel = () => {
      setSelectedCell(null);
      setIsModalVisible(false); // Đóng modal
   };

   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const userData = params.get("user");

      if (token && userData) {
         try {
            const parsedUser = JSON.parse(userData);
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

   // Ham tra ve thu 2
   const getMonday = (date) => {
      let d = new Date(date);
      let day = d.getDay(); // getDay() trả về số nguyên từ 0 đến 6 tương ứng với ngày trong tuần 0:CN

      let diff = day === 0 ? -6 : 1 - day;
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

   const generateWeekDays = (offset) => {
      let startMonday = getMonday(new Date()); // Lấy thứ 2 của tuần hiện tại
      startMonday.setDate(startMonday.getDate() + offset * 7); // Dịch tuần theo offset

      let days = [];
      for (let i = 0; i < 7; i++) { // Chỉ lấy 7 ngày của tuần hiện tại
         let date = new Date(startMonday);
         date.setDate(startMonday.getDate() + i);

         days.push({
            date: date.toLocaleDateString("vi-VN", { day: "2-digit", month: "2-digit" }).replace(/\./g, "/"),
            dayOfWeek: convertWeekday(date.toLocaleDateString("vi-VN", { weekday: "long" }))
         });
      }

      return days;
   };

   const weekDays = useMemo(() => generateWeekDays(currentWeekOffset), [currentWeekOffset]);

   const generateTimeSlots = () => {
      let times = [];
      let startTime = dayjs().hour(5).minute(0).second(0);
      let endTime = dayjs().hour(23).minute(30);

      while (startTime.isBefore(endTime)) {
         times.push(startTime.format("HH:mm"));
         startTime = startTime.add(30, "minute");
      }

      return times;
   };

   const timeSlots = generateTimeSlots();

   const bookingData = {
      user: user,
      football: sanBong,
      date: selectedBooking.date,
      time: selectedBooking.time,
   };

   // console.log(sanBong.id)
   const getBookingInfo = useMemo(() => {
      return (day, time) => {
         return bookings.find(
            (booking) =>
               booking.date === day.date && // Kiểm tra ngày
               booking.timeStart.slice(0, 5) === time // So sánh giờ (bỏ giây nếu có)
         );
      };
   }, [bookings]); // Chỉ cập nhật khi bookings thay đổi

   const fetchAPIBooking = async () => {
      try {
         let response = await axios.get(`/api/bookingUser/${sanBong.id}`)
         // console.log(response)
         if (response.data.success) {
            const updatedBookings = response.data.data.map(booking => ({
               ...booking,
               date: dayjs(booking.date).format("DD-MM"), // Vd: chuyển "2025-03-24" -> "24-03"
               timeStart: booking.timeStart.slice(0, 5), // vd: chuyển "20:00:00+00" -> "20:00"
               timeEnd: booking.timeEnd.slice(0, 5)
            }));
            setBookings(updatedBookings);
         } else {
            console.log(response.data.message)
         }
      } catch (e) {
         console.log(e)
      }
   };
   useEffect(() => {
      fetchAPIBooking();
   }, [sanBong.id]);

   return (
      <>
         <Header />
         <div className="booking-container">
            <h4><span>{sanBong.name}</span></h4>
            <div className="calendar-container">
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
                  <div className="time-header">
                     {timeSlots.map((time, index) => (
                        <div key={index} className="time-slot">{time}</div>
                     ))}
                  </div>
                  <div className="calendar-container">
                     <div className="header-row">
                        <div className="corner-box"></div>
                     </div>
                     {timeSlots.map((time, timeIndex) => (
                        <div key={timeIndex} className="time-row">
                           {weekDays.map((day, dayIndex) => {
                              const bookingInfo = getBookingInfo(day, time); // Tìm booking tương ứng

                              return (
                                 <div
                                    key={dayIndex}
                                    className={`content-booking 
                                    ${selectedCell === `${day.date}-${time}` ? "selected" : ""} 
                                    ${bookings.some(b =>
                                       b.date === day.date &&
                                       time >= b.timeStart.slice(0, 5) &&
                                       time < b.timeEnd.slice(0, 5)) ? "selected" : ""}`}
                                    onClick={() => handleClick(day.date, time)}
                                 >
                                    {bookings.some(b => b.date === day.date && time === b.timeStart.slice(0, 5)) ? (
                                       <>
                                          {bookings
                                             .filter(b => b.date === day.date && time === b.timeStart.slice(0, 5))
                                             .map((b, index) => (
                                                <div key={index} className="content">
                                                   <p>{b.id}{b.id_FF}{b.id_User || 0}{b.id_Business || 0}_{b.price}</p>
                                                </div>
                                             ))}
                                       </>
                                    ) : ""}
                                 </div>
                              );
                           })}
                        </div>
                     ))}
                     <BookingModel
                        isModalOpen={isModalVisible}
                        handleCancel={handleCancel}
                        bookingData={bookingData}
                        fetchAPIBooking={fetchAPIBooking}
                     />
                  </div>
               </div>
            </div>
            <div className="booking-controls">
               <button onClick={() => setCurrentWeekOffset(prev => prev - 1)}><FaArrowAltCircleLeft /></button>
               <p>Tuần {currentWeekOffset === 0 ? "hiện tại" : `${currentWeekOffset + 1}`}</p>
               <button onClick={() => setCurrentWeekOffset(prev => prev + 1)}><FaArrowAltCircleRight /></button>
            </div>
            <ContentBooking football={sanBong} />
         </div >
         <Footer />
      </>
   );
}