import { useLocation, useParams } from "react-router-dom";

export default function BookingBusiness() {
   const { id } = useParams(); // Lấy id từ URL
   const location = useLocation();
   const sanBong = location.state || {}; // Nhận dữ liệu từ state

   console.log("ID từ URL:", id);
   console.log("Dữ liệu sân bóng:", sanBong);

   return (
      <>
         <h1>Thông tin sân bóng</h1>
         <p>ID: {id}</p>
         <p>Tên: {sanBong.name || "Không có dữ liệu"}</p>
         <p>Kích thước: {sanBong.size}</p>
         <p>Giá: {sanBong.price}</p>
         <p>Địa chỉ: {sanBong.address}</p>
      </>
   );
}
