import { useLocation } from "react-router-dom";
import Header from "../../../layouts/Header/Header";
import Footer from "../../../layouts/Footer/Footer";
import dayjs from "dayjs";
import { useState, useEffect, useMemo } from "react";
import './BookingBusiness.scss';
// import { BookingModel } from "../../../components/Model/Booking/BookingModel";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaArrowAltCircleLeft, FaArrowAltCircleRight } from "react-icons/fa";
export default function BookingBusiness() {
   const navigate = useNavigate();
   const [selectedCell,] = useState(null);
   const [, setUser] = useState([]);
   const [bookings, setBookings] = useState([]);
   const [currentWeekOffset, setCurrentWeekOffset] = useState(0);

   const location = useLocation();
   const sanBong = location.state || {}; // Nhận dữ liệu từ state


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

   const getMonday = (date) => {
      let d = new Date(date);
      let day = d.getDay();
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

   const weekDays = useMemo(() => generateWeekDays(currentWeekOffset), [currentWeekOffset, generateWeekDays]);

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

   const fetchAPIBooking = async () => {
      try {
         let response = await axios.get(`/api/bookingUser/${sanBong.id}`)
         console.log(response)
         if (response.data.success) {
            const updatedBookings = response.data.data.map(booking => ({
               ...booking,
               date: dayjs(booking.date).format("DD-MM"), // Chuyển "2025-03-24" -> "24-03"
               timeStart: booking.timeStart.slice(0, 5), // Chuyển "20:00:00+00" -> "20:00"
               timeEnd: booking.timeEnd.slice(0, 5) // Chuyển "21:00:00+00" -> "21:00"
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
            <h4><span>{sanBong.name}</span> CỦA TÔI</h4>
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

                              return (
                                 <div
                                    key={dayIndex}
                                    className={`content-booking-business
                                    ${selectedCell === `${day.date}-${time}` ? "selected" : ""} 
                                    ${bookings.some(b =>
                                       b.date === day.date &&
                                       time >= b.timeStart.slice(0, 5) &&
                                       time < b.timeEnd.slice(0, 5)) ? "selected" : ""}`}

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
                  </div>
               </div>
            </div>
            <div className="booking-controls">
               <button onClick={() => setCurrentWeekOffset(prev => prev - 1)}><FaArrowAltCircleLeft /></button>
               <p>Tuần {currentWeekOffset === 0 ? "hiện tại" : `${currentWeekOffset + 1}`}</p>
               <button onClick={() => setCurrentWeekOffset(prev => prev + 1)}><FaArrowAltCircleRight /></button>
            </div>
         </div >
         <Footer />
      </>
   );
}