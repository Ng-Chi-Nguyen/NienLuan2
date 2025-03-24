import { useLocation, useParams } from "react-router-dom";
import Header from "../../components/Header/Header";
export default function BookingBusiness() {
   const { id } = useParams(); // Lấy id từ URL
   const location = useLocation();
   const sanBong = location.state || {}; // Nhận dữ liệu từ state

   console.log("ID từ URL:", id);
   console.log("Dữ liệu sân bóng:", sanBong);

   return (
      <>
         <Header />
         <h4>Lich đặt sân của sân bóng {sanBong.name}</h4>
      </>
   );
}
