import { useEffect, useState, useCallback } from "react";
import './Booking.scss';
import dayjs from "dayjs";
import { RiDeleteBin2Line } from "react-icons/ri";
import { MdOutlinePayments } from "react-icons/md";
import { Tag, Pagination } from 'antd';
import { getBusinessById } from "../../../services/business.service";
import { getBookingsByUser, getBookingsForTodayByBusiness, deleteBooking } from "../../../services/booking.service";
import { getFootballFieldById } from "../../../services/footballField.service";
import { formatNumber } from "../../../utils/utils";
import { Invoice } from "../../../components/Model/Invoice/Invoice";
import { useModal } from "../../../components/hooks/useModel";
export function BookingUser({ user }) {
   const [booking, setBookings] = useState([])
   const [businessMap, setBusinessMap] = useState({});
   const [footballFieldMap, setFootballFieldMap] = useState({});
   const [currentPage, setCurrentPage] = useState(1);


   const fetchAPIBooking = useCallback(async () => {
      const updatedBookings = await getBookingsByUser(user?.id, user?.type);
      setBookings(updatedBookings);
   }, [user?.id, user?.type]);

   const BusinessGetById = useCallback(async (id_Business) => {
      const businessData = await getBusinessById(id_Business);
      if (businessData) {
         setBusinessMap(prev => ({
            ...prev,
            [id_Business]: businessData
         }));
      }
   }, []);

   const FootballFieldGetById = useCallback(async (id_FF) => {
      const fieldData = await getFootballFieldById(id_FF);
      if (fieldData) {
         setFootballFieldMap(prev => ({
            ...prev,
            [id_FF]: fieldData // Lưu theo ID sân bóng
         }));
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
   }, [businessMap, booking, BusinessGetById]);

   useEffect(() => {
      booking.forEach(item => {
         if (item.id_FF && !footballFieldMap[item.id_FF]) {
            FootballFieldGetById(item.id_FF);
         }
      });
   }, [booking, businessMap, FootballFieldGetById, footballFieldMap]);


   let handleDeleteBooking = async (id) => {
      const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa lịch đặt sân này không?");
      if (!confirmDelete) return;
      const isDeleted = await deleteBooking(id);
      if (isDeleted) {
         setBookings(prevData => prevData.filter(item => item.id !== id)); // Cập nhật danh sách sau khi xóa
      }
   }

   const itemsPerPage = 5; // Số lượng mục trên mỗi trang
   // Tính toán danh sách hiển thị
   const indexOfLastItem = currentPage * itemsPerPage;
   const indexOfFirstItem = indexOfLastItem - itemsPerPage;
   const currentBookings = booking.slice(indexOfFirstItem, indexOfLastItem);


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
                        {currentBookings.length > 0 ? (
                           currentBookings.map((item, index) => (
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
                                    <button className="co-red"><RiDeleteBin2Line onClick={() => handleDeleteBooking(item.id)} /></button>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan="9" className="text-center">Không có dữ liệu</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
               <Pagination
                  align="end"
                  current={currentPage}
                  pageSize={itemsPerPage}
                  total={booking.length}
                  onChange={(page) => setCurrentPage(page)}
                  showSizeChanger={false} // Không cho phép chọn số item mỗi trang
                  style={{ textAlign: "center", marginTop: "20px" }}
               />
            </div>
         </div>
      </>
   )
}

export function BookingFootball({ user }) {
   const [booking, setBookings] = useState([])
   const [businessMap, setBusinessMap] = useState({});
   const [footballFieldMap, setFootballFieldMap] = useState({});
   const [selectedInvoice, setSelectedInvoice] = useState(null);
   const modelInvoice = useModal()


   const fetchAPIBooking = useCallback(async () => {
      const updatedBookings = await getBookingsForTodayByBusiness(user?.id);
      setBookings(updatedBookings);
   }, [user?.id]);

   const BusinessGetById = useCallback(async (id_Business) => {
      const businessData = await getBusinessById(id_Business);
      if (businessData) {
         setBusinessMap(prev => ({
            ...prev,
            [id_Business]: businessData // Lưu theo ID doanh nghiệp
         }));
      }
   }, []);

   const FootballFieldGetById = useCallback(async (id_FF) => {
      const fieldData = await getFootballFieldById(id_FF);
      if (fieldData) {
         setFootballFieldMap(prev => ({
            ...prev,
            [id_FF]: fieldData // Lưu theo ID sân bóng
         }));
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
   }, [booking, businessMap, BusinessGetById]);

   useEffect(() => {
      booking.forEach(item => {
         if (item.id_FF && !footballFieldMap[item.id_FF]) {
            FootballFieldGetById(item.id_FF);
         }
      });
   }, [booking, footballFieldMap, FootballFieldGetById]);


   const handleInvoice = (item) => {
      setSelectedInvoice(item);
      console.log(selectedInvoice)
      modelInvoice.showModal();
   };
   // console.log(booking)
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
                                    <button className="co-green">
                                       <MdOutlinePayments
                                          onClick={() => handleInvoice(item)}
                                       />
                                    </button>
                                 </td>
                              </tr>
                           ))
                        ) : (
                           <tr>
                              <td colSpan="9" className="text-center">Không có dữ liệu</td>
                           </tr>
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
            <Invoice
               open={modelInvoice.isOpen}
               onClose={modelInvoice.hideModal}
               data={selectedInvoice}
            // businessData={businessData}
            />
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