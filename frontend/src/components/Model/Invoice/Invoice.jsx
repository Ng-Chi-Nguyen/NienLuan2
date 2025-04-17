import { Modal } from "antd";
import { useState, useEffect } from "react";
import "./Invoice.scss";
import { getBusinessById } from "../../../services/business.service";
export function Invoice({ open, onClose, data }) {
   const [business, setBusiness] = useState(null);

   useEffect(() => {
      const fetchData = async () => {
         try {
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
               <h2 className="title">HÓA ĐƠN ĐẶT SÂN</h2>

               <div className="info">
                  <p><strong>Số chứng từ:</strong> {data?.id}</p>
                  <p><strong>Thời gian đặt sân:</strong> {new Date(data?.created_at).toLocaleString() || new Date().toLocaleString()}</p>
                  <p><strong>Thời gian đá:</strong> {data?.timeStart || "Chưa có"} đến {data?.timeEnd || "Chưa có"} ngày {data?.date || "Chưa có"}</p>
                  <p><strong>Doanh nghiệp:</strong> {business?.[0]?.name || "Chưa có"}</p>
               </div>

               <div className="summary">
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
