import './BookingModel.scss';

import { useState, useEffect } from 'react';
import { TimePicker, Modal } from "antd";

import dayjs from 'dayjs';

import { HiArrowLongRight } from "react-icons/hi2";

import { Message } from '../../../utils/utils';
import { formatNumber } from '../../../utils/utils';
import { getBusinessById } from '../../../services/business.service';
import { createBooking } from '../../../services/booking.service';


export function BookingModel({ isModalOpen, handleCancel, bookingData, fetchAPIBooking }) {

   const [endTime, setEndTime] = useState(0); // lưu thời gian kết thúc khi người dùng chọn từ TimePicker
   const [business, setBusiness] = useState(null)
   const [loading, setLoading] = useState(false)

   // startTime: chuyển bookingData.time thành đối tượng dayjs để dễ xử lý thời gian
   const startTime = dayjs(bookingData.time, "HH:mm");
   // pricePerHour: giá thuê sân theo giờ
   const pricePerHour = bookingData.football.price;

   // Xử lý chọn thời gian kết thúc
   const handleTimeChange = (time) => {
      setEndTime(time);
   };
   // Tính tổng giá dựa trên số giờ đặt
   const calculatePrice = () => {
      if (!endTime) return 0;
      const diffInMinutes = endTime.diff(startTime, "minute");
      const hours = diffInMinutes / 60;
      // Trả về tổng giá = đơn giá/giờ × số giờ đã tính
      return pricePerHour * hours;
   };
   // console.log(formatNumber(calculatePrice()))

   useEffect(() => {
      const fetchBusinessData = async (id) => {
         if (!id) {
            console.log(`Không tìm thấy ${id}`);
            return;
         }

         try {
            const businessData = await getBusinessById(id);
            setBusiness(businessData); // Lưu dữ liệu vào state
         } catch (e) {
            console.log("Lỗi khi lấy thông tin doanh nghiệp:", e);
         }
      };

      if (bookingData.football?.idBusiness) {
         fetchBusinessData(bookingData.football.idBusiness);
      }
   }, [bookingData.football?.idBusiness]);
   // console.log("business:", business[0].owner_name)

   let handleSubmit = async (e) => {
      e.preventDefault();
      setLoading(true)
      // Lấy dữ liệu form → tạo object data chứa toàn bộ thông tin từ các ô input
      const formData = new FormData(e.target);
      const data = Object.fromEntries(formData.entries());

      // Chuyển date từ "DD-MM" thành "YYYY-MM-DD"
      let [day, month] = data.date.split("-");
      let today = new Date(); // Lấy giờ hiện tại
      let year = today.getFullYear(); // Lấy năm hiện tại
      let formattedDate = `${year}-${month}-${day}`; // Định dạng YYYY-MM-DD

      data.date = formattedDate; // Cập nhật lại data trước khi gửi
      formData.set("date", formattedDate); // Nếu gửi FormData

      // Lấy type từ localStorage
      const userData = localStorage.getItem("user");
      if (userData) {
         const user = JSON.parse(userData);
         data.userType = user.type; // Thêm vào object data
         formData.set("userType", user.type); // Thêm vào FormData
      }

      // console.log("Dữ liệu gửi lên:", data);

      try {
         let response = await createBooking(data);
         if (response.success) {
            setEndTime(0);
            await fetchAPIBooking();
            handleCancel();
            Message("Đặt sân thành công", response.message, "success");
         } else {
            handleCancel();
            Message("Đặt sân thất bại", response.message, "error");
         }
      } catch (e) {
         Message("Đặt sân thất bại", e, "error");
      }
      setLoading(false)
   };

   return (
      <Modal
         title="Chi tiết đặt sân"
         open={isModalOpen}
         onCancel={handleCancel}
         footer={null}
      >
         <form className='formBooking' onSubmit={handleSubmit}>
            <div className="item">
               <label>Khách hàng: <span>{bookingData.user?.owner_name || bookingData.user?.name}</span></label>
               <input name='id_User' type="hidden" value={bookingData.user?.id} />
            </div>
            <div className="item">
               <label>Sân bóng : <span>{bookingData.football?.name}</span></label>
               <input name='id_FF' type="hidden" value={bookingData.football?.id} />
            </div>
            <div className="item">
               <label>Chủ sân: <span>{business && business.length > 0 ? business[0].owner_name : "Đang tải..."}</span></label>
               <input name='id_Business' type="hidden" value={business?.[0]?.id || ""} />
            </div>
            <div className="item">
               <label>Ngày đặt sân bóng: <span>{bookingData.date}</span></label>
               <input name='date' type="hidden" value={bookingData.date} />
            </div>
            <div className="item">
               <label>Giờ đặt sân: <span>{bookingData.time}</span> <HiArrowLongRight /> </label>
               <TimePicker
                  value={endTime}
                  disabledTime={() => ({
                     disabledHours: () => {
                        const startHour = startTime.hour();
                        return [...Array(startHour + 1).keys()];
                     },
                     disabledMinutes: (selectedHour) => {
                        const startHour = startTime.hour();
                        const startMinutes = startTime.minute();

                        if (selectedHour === startHour) {
                           return [...Array(startMinutes + 30).keys()];
                        }
                        return [];
                     },
                  })}
                  format="HH:mm"
                  minuteStep={30}
                  showNow={false}
                  onChange={handleTimeChange}
               />
               <input name='timeStart' type="hidden" value={bookingData.time} />
               <input name='timeEnd' type="hidden" value={endTime ? endTime.format("HH:mm") : ""} />
            </div>
            <div className="item">
               <label>
                  Giá: <span>{formatNumber(calculatePrice())}</span> VND
                  <input name='price' type="hidden" value={(calculatePrice())} />
               </label>
            </div>
            <div className="item">
               <button type='submit'>{loading ? "Đang đặt sân" : "Đặt sân ngay"}</button>
            </div>
         </form>
      </Modal >
   )
}