import { useEffect, useState } from "react";
import "./contentBooking.scss";
import axios from "axios";
import dayjs from "dayjs";

export default function ContentBooking({ football }) {
   const [images, setImages] = useState([]); // Lưu danh sách hình ảnh
   const [business, setBusiness] = useState([]);
   const [address, setAddress] = useState("")
   // Hàm lấy hình ảnh từ API
   const fetchImages = async () => {
      try {
         const response = await axios.get(`/api/foolbalField/${football.id}/images`);
         console.log(response);

         if (response.data.success) {
            setImages(Array.isArray(response.data.image)
               ? response.data.image.map(img => img.image_url)
               : []
            );
         }
      } catch (error) {
         console.error("Lỗi khi lấy hình ảnh:", error);
      }
   };

   const fetchBusiness = async () => {
      try {
         const response = await axios.get(`/api/business/${football.idBusiness}`);
         if (response.data.success) {
            setBusiness(response.data.data)
         }
      } catch (error) {
         console.error("Lỗi khi lấy hình ảnh:", error);
      }
   }

   const fetchAddress = async () => {
      try {
         const response = await axios.get(`/api/address/${football.idProvince}/${football.idDistrict}/${football.idWard}`);
         console.log(response)
         if (response.data.success) {
            setAddress(response.data.data);
         }
      } catch (error) {
         console.error("Lỗi khi lấy địa chỉ:", error);
         setAddress("Không thể tải địa chỉ");
      }
   };

   useEffect(() => {
      if (football?.id) {
         fetchImages();
      }
   }, [football]);

   useEffect(() => {
      fetchBusiness();
   }, [football]);

   useEffect(() => {
      if (football?.idProvince && football?.idDistrict && football?.idWard) {
         fetchAddress();
      }
   }, [football]);

   // console.log(football)
   console.log(address)
   return (
      <div className="container">
         <div className="ContentBooking">
            <div className="left">
               <p>ẢNH MÔ TẢ</p>
               <div className="image-container">
                  {images.length > 0 ? (
                     images.map((img, index) => (
                        <img key={index} src={img} alt={`Hình ${index + 1}`} className="field-image" />
                     ))
                  ) : (
                     <p>Không có hình ảnh</p>
                  )}
               </div>
            </div>
            <div className="right">
               <div className="business-info">
                  <p>THÔNG TIN</p>
                  <div className="content-info">
                     <div className="item">
                        Tên doanh nghiệp: <span>{business[0]?.name || "Chưa có thông tin"}</span>
                     </div>
                     <div className="item">
                        Tên chủ doanh nghiệp: <span>{business[0]?.owner_name || "Chưa có thông tin"}</span>
                     </div>
                     <div className="item">
                        Số điện thoại:  <span>{business[0]?.phone || "Chưa có thông tin"}</span>
                     </div>
                     <div className="item">
                        Email:  <span>{business[0]?.email || "Chưa có thông tin"}</span>
                     </div>
                     <div className="item">
                        Loại sân:  <span>{football.size} người</span>
                     </div>
                     <div className="item">
                        Giá:  <span>{football.price} / 1h</span>
                     </div>
                     <div className="item">
                        Địa chỉ doanh nghiệp: <span>{business[0]?.address || "Chưa có thông tin"}</span>
                     </div>
                     <div className="item">
                        Địa chỉ sân bóng: <span>{address}</span>
                     </div>
                     <div className="item">
                        Ngày thành lập doanh nghiệp: <span>{dayjs(football.created_at).format("DD/MM/YYYY")}</span>
                     </div>
                  </div>
               </div>
            </div>
         </div>
      </div>
   );
}
