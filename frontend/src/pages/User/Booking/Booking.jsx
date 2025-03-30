import { useEffect, useState, useCallback } from "react";
import { Link } from "react-router-dom";
import './Booking.scss';
import axios from "axios";
import dayjs from "dayjs";
import { CiEdit } from "react-icons/ci";
import { RiDeleteBin2Line } from "react-icons/ri";
import { MdOutlinePayments } from "react-icons/md";
import { Tag } from 'antd';
export function BookingUser({ user }) {
   const [booking, setBookings] = useState([])
   const [businessMap, setBusinessMap] = useState({});
   const [footballFieldMap, setFootballFieldMap] = useState({});

   const fetchAPIBooking = useCallback(async () => {
      if (!user?.id || !user?.type) return;
      try {
         let response = await axios.get(`/api/bookingUser/userInfo/${user.id}?type=${user.type}`);
         console.log(response);
         if (response.data.success) {
            const updatedBookings = response.data.data.map(booking => ({
               ...booking,
               date: dayjs(booking.date).format("DD-MM"),
               timeStart: booking.timeStart.slice(0, 5),
               timeEnd: booking.timeEnd.slice(0, 5),
            }));

            setBookings(updatedBookings);
         } else {
            console.log("Lỗi từ API:", response.data.message);
         }
      } catch (e) {
         console.log(e);
      }
   }, [user?.id, user?.type]);

   const BusinessGetById = useCallback(async (id_Business) => {
      if (!id_Business) {
         console.log(`Không tìm thấy ${id_Business}`);
         return;
      }
      try {
         let response = await axios.get(`/api/business/${id_Business}`);
         if (response.data.success) {
            setBusinessMap(prev => ({
               ...prev,
               [id_Business]: response.data.data // Lưu theo ID doanh nghiệp
            }));
         }
      } catch (e) {
         console.error("Lỗi khi lấy thông tin doanh nghiệp:", e);
      }
   }, []);

   const FootballFieldGetById = useCallback(async (id_FF) => {
      if (!id_FF) {
         console.log(`Không tìm thấy sân bóng với ID: ${id_FF}`);
         return;
      }
      try {
         let response = await axios.get(`/api/foolbalField/football/${id_FF}`);
         console.log(response)
         if (response.data.success) {
            setFootballFieldMap(prev => ({
               ...prev,
               [id_FF]: response.data.data // Lưu theo ID sân bóng
            }));
         }
      } catch (e) {
         console.error("Lỗi khi lấy thông tin sân bóng:", e);
      }
   }, []);

   useEffect(() => {
      fetchAPIBooking();
   }, [fetchAPIBooking]);

   useEffect(() => {
      booking.forEach(item => {
         if (item.id_Business && !businessMap[item.id_Business]) {
            BusinessGetById(item.id_Business);
         }
      });
   }, [booking, BusinessGetById]);

   useEffect(() => {
      booking.forEach(item => {
         if (item.id_FF && !footballFieldMap[item.id_FF]) {
            FootballFieldGetById(item.id_FF);
         }
      });
   }, [booking, FootballFieldGetById]);

   // console.log("booking", booking)
   // console.log("footballFieldMap", footballFieldMap)
   // console.log("business", businessMap[15].name)

   const formatNumber = (n) => {
      return new Intl.NumberFormat("en-US", {
         style: "decimal",
         minimumFractionDigits: 0,
      }).format(n);
   };
   return (
      <>
         <div className="Booking">
            <div className="item-bk">
               <div className="table-responsive">
                  <table className="table">
                     <thead>
                        <tr>
                           <th scope="col">Tên sân</th>
                           <th scope="col">Tên doanh nghiệp</th>
                           <th scope="col">Ngày đá</th>
                           <th scope="col">Giờ bắt đầu</th>
                           <th scope="col">Giờ kêt thúc</th>
                           <th scope="col">Giá (vnđ)</th>
                           <th scope="col">Thời điểm đắt lịch</th>
                           <th scope="col">Trạng thái</th>
                           <th scope="col">Action</th>
                        </tr>
                     </thead>
                     <tbody>
                        {booking.length > 0 ? (
                           booking.map((item, index) => (
                              <tr key={index}>
                                 <td>{footballFieldMap[item.id_FF]?.[0]?.name || "Đang tải..."}</td>
                                 <td>{businessMap[item.id_Business]?.[0]?.name || "Đang tải..."}</td>
                                 <td className="text-center">{item.date}</td>
                                 <td className="text-center">{item.timeStart}</td>
                                 <td className="text-center">{item.timeEnd}</td>
                                 <td className="text-center">{formatNumber(item.price)}</td>
                                 <td>{dayjs(item.created_at).format("DD/MM/YYYY HH:mm:ss")}</td>
                                 <td className="text-center">
                                    {item.status === 1 ? (
                                       <Tag color="magenta">Chưa diễn ra</Tag>
                                    ) : item.status === 2 ? (
                                       <Tag color="orange">Đang diễn ra</Tag>
                                    ) : item.status === 3 ? (
                                       <Tag color="blue">Đã kết thúc</Tag>
                                    ) : (
                                       <Tag color="green">Đã hủy</Tag>
                                    )}
                                 </td>
                                 <td className="text-center">
                                    <button><CiEdit /></button>
                                    <button><RiDeleteBin2Line /></button>
                                    <button><MdOutlinePayments /></button>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td className="text-center no-bk">
                                 Không có lịch đặt nào. <Link to="/Schedule">Đặt ngay</Link>
                              </td>
                           </tr>
                        )}

                     </tbody>
                  </table>
               </div>
            </div>

         </div>
      </>
   )
}

export function BookingFootball() {
   return (
      <>
         <div className="BookingFootball">
            BookingFootball page
         </div>
      </>
   )
}

export function NextLavel() {
   return (
      <>
         <div className="NextLavel">
            NextLavel page
         </div>
      </>
   )
}