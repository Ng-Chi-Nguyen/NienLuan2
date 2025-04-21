import { Modal } from "antd";
import { useState, useEffect } from "react";
import "./Invoice.scss";
import { getBusinessById } from "../../../services/business.service";
import { getUserById } from "../../../services/user.service";
import { getFootballFieldById } from "../../../services/footballField.service";
import { Message } from "../../../utils/utils";
export function Invoice({ open, onClose, data }) {
   const [business, setBusiness] = useState(null);
   const [client, setClient] = useState(null);
   const [football, setFootball] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
            Message("Đang tải", "Thông tin doanh nghiệp đang được tải...", "info");
            const dataBusiness = await getBusinessById(data.id_Business);

            setBusiness(dataBusiness);
         } catch (err) {
            console.error("Lỗi khi gọi API:", err);
         }
      };

      if (data?.id_Business) {
         fetchData();
      }
   }, [data]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            Message("Đang tải", "Thông tin khách hàng đang được tải...", "info");
            const dataUser = await getUserById(data.id_User);
            setClient(dataUser);
         } catch (err) {
            console.error("Lỗi khi gọi API:", err);
         }
      };

      if (data && data.id_User) {
         fetchData();
      }
   }, [data]);

   useEffect(() => {
      const fetchData = async () => {
         try {
            Message("Đang tải", "Thông tin sân bóng đang được tải...", "info");
            const dataFootball = await getFootballFieldById(data.id_FF);
            setFootball(dataFootball);
         } catch (err) {
            console.error("Lỗi khi gọi API:", err);
         }
      };

      if (data && data.id_User) {
         fetchData();
      }
   }, [data]);


   function getDuration(timeStart, timeEnd) {
      const [startHour, startMinute] = timeStart.split(":").map(Number);
      const [endHour, endMinute] = timeEnd.split(":").map(Number);

      const start = new Date(0, 0, 0, startHour, startMinute);
      const end = new Date(0, 0, 0, endHour, endMinute);

      let diff = (end - start) / 1000; // tính theo giây

      if (diff < 0) {
         diff += 24 * 3600; // xử lý nếu giờ kết thúc qua ngày hôm sau
      }

      const hours = Math.floor(diff / 3600);
      const minutes = Math.floor((diff % 3600) / 60);

      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}`;
   }

   return (
      <>
         <Modal
            open={open}
            onCancel={onClose}
            footer={null}
            width={400}
            title={null}
            closable={false}
            className="invoice-modal"
         >
            <div className="receipt">
               <h2 className="title_business">{business?.[0]?.name || "Chưa có"}</h2>
               <p className="text-center name_invoice">HÓA ĐƠN ĐẶT SÂN</p>
               <div className="info">
                  <p><strong>Tên khách hàng:</strong> {client?.[0]?.name} </p>
                  <p><strong>Địa chỉ:</strong> {client?.[0]?.address || "Chưa cập nhật"} </p>
                  <hr />
                  <p><strong>Số chứng từ:</strong> {data?.id}</p>
                  <p><strong>Thời gian đặt sân:</strong> {new Date(data?.created_at).toLocaleString() || new Date().toLocaleString()}</p>
                  <p><strong>Thời gian đá:</strong> {data?.timeStart || "Chưa có"} đến {data?.timeEnd || "Chưa có"} ngày {data?.date || "Chưa có"}</p>
                  <p><strong>Sân bóng:</strong> {football?.[0]?.name || "Chưa cập nhật"} ({football?.[0]?.size} người)</p>
               </div>
               <div className="summary">
                  <p><strong>Thời lượng:  </strong>
                     {
                        data?.timeStart && data?.timeEnd
                           ? `${getDuration(data.timeStart, data.timeEnd)} - (${football?.[0]?.price?.toLocaleString()} / 1h)`
                           : "Chưa xác định"
                     }
                  </p>
                  <p><strong>Tổng số tiền:</strong> {data?.price?.toLocaleString()} đ</p>
                  <p><strong>Người thu:</strong> {business?.[0]?.owner_name || "Chưa có"}</p>
                  <p><strong>Phương thức:</strong> Thanh toán sau trận đấu</p>
               </div>

               <div className="footer">
                  <p>Quý khách vui lòng kiểm tra thông tin trước khi rời khỏi cửa hàng</p>
                  <p>Giữ hóa đơn khi cần hỗ trợ</p>
                  <p><em>Cảm ơn quý khách, hẹn gặp lại!</em></p>
               </div>
            </div>
         </Modal >
      </>
   );
}
