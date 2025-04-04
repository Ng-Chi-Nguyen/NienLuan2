import { Search } from "../../components/Button/Button";
import { AddressSelector, AddressFetcher } from "../../components/Address/Address";
import { Pagination } from "antd";
import Header from "../../components/Header/Header";
import Footer from "../../components/Footer/Footer";
import "./Schedule.scss";
import { useNavigate } from "react-router-dom";

import { FaUser } from "react-icons/fa";
import { PiMoneyWavyDuotone } from "react-icons/pi";

import { useState, useEffect } from "react";

export default function Schedule() {
   const [, setAddress] = useState({
      province: "",
      district: "",
      ward: "",
   });
   const [data, setData] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [addressData, setAddressData] = useState();
   const [images, setImages] = useState([]);

   const navigate = useNavigate();

   const itemsPerPage = 8; // Số lượng sân hiển thị mỗi trang

   // Lấy danh sách sân hiển thị trên trang hiện tại
   const startIndex = (currentPage - 1) * itemsPerPage;
   const paginatedData = data.slice(startIndex, startIndex + itemsPerPage);

   useEffect(() => {
      const fetchFootballFields = async () => {
         try {
            const response = await fetch(`/api/foolbalField/`);
            const result = await response.json();

            if (result.success) {
               const DataFootball = result.data.map((item, index) => ({
                  ...item,
                  key: item.id || index.toString(),
               }));
               setData(DataFootball);

               // Gọi fetchImages() cho từng sân bóng
               DataFootball.forEach(field => {
                  if (field.id) fetchImages(field.id);
               });
            } else {
               console.error("Lỗi:", result.message);
            }
         } catch (error) {
            console.error("Lỗi kết nối API:", error);
         }
      };

      fetchFootballFields();
   }, []);


   useEffect(() => {
      const fetchAddressData = async () => {
         const newAddressData = {};
         for (const item of data) {
            // console.log(`Đang fetch địa chỉ cho sân ID: ${item.id}`); // Debug ID sân
            if (item.idProvince && item.idDistrict && item.idWard) {
               const { province, district, ward } = await AddressFetcher(
                  item.idProvince,
                  item.idDistrict,
                  item.idWard
               );
               // console.log(`Kết quả cho ID ${item.id}:`, { province, district, ward }); // Debug kết quả
               newAddressData[item.id] = { province, district, ward };
            }
         }
         setAddressData(newAddressData);
         // console.log("Dữ liệu địa chỉ sau khi fetch:", newAddressData); // Debug toàn bộ dữ liệu
      };

      if (data.length > 0) {
         fetchAddressData();
      }
   }, [data]);


   const formatNumber = (n) => {
      return new Intl.NumberFormat("en-US", {
         style: "decimal",
         minimumFractionDigits: 0,
      }).format(n);
   };

   // console.log(data)

   const fetchImages = async (fieldId) => {
      if (!fieldId) {
         console.warn("fieldId không hợp lệ:", fieldId);
         return;
      }
      try {
         const response = await fetch(`/api/foolbalField/${fieldId}/images`);
         const result = await response.json();
         // console.log(`Hình ảnh cho sân ID ${fieldId}:`, result);

         if (result.success && result.image.length > 0) {
            setImages((prevImages) => ({
               ...prevImages,
               [fieldId]: result.image[0].image_url, // Chỉ lấy ảnh đầu tiên
            }));
         } else {
            setImages((prevImages) => ({ ...prevImages, [fieldId]: null }));
         }
      } catch (error) {
         console.error("Lỗi tải ảnh:", error);
      }
   };

   const handleBookingUserClickPage = (sanBong) => {
      navigate(`/BookingUser/${sanBong.id}`, { state: sanBong });
   };


   return (
      <>
         <Header />
         <div className="SchedulePage">
            <div className="container">
               <div className="row">
                  {/* Bộ lọc sân bóng */}
                  <div className="left col-xl-3">
                     <h4>Lọc sân bóng</h4>
                     <AddressSelector onSelect={setAddress} />
                  </div>

                  {/* Danh sách sân bóng */}
                  <div className="right col-xl-9">
                     <div className="mg-r row justify-content-center">
                        <Search name="Tìm sân bóng" />
                     </div>
                     <h2 className="text-center">Bãi sân</h2>
                     <div className="row">
                        {paginatedData.length > 0 ? (
                           paginatedData.map((item) => (
                              <div className="Box" key={item.id} onClick={() => handleBookingUserClickPage(item)}>
                                 <div className="top">
                                    {images[item.id] ? (
                                       <img src={`${process.env.REACT_APP_API_URL}${images[item.id]}`} alt="Sân bóng" />
                                    ) : (
                                       <p>Chưa có ảnh</p>
                                    )}
                                 </div>
                                 <div className="bottom">
                                    <div className="name">{item.name}</div>
                                    <div className="size">
                                       <p>Sân {item.size}</p> <span><FaUser /></span>
                                    </div>
                                    <div className="price">
                                       <p>Giá: {formatNumber(item.price)}</p>
                                       <span><PiMoneyWavyDuotone /></span>
                                       <p>/{item.size === 11 ? ("90") : ("60")}p</p>
                                    </div>
                                    <div className="address">
                                       Địa chỉ: {item.address}
                                       {addressData && addressData[item.id] && (
                                          `, ${addressData[item.id].ward}, ${addressData[item.id].district}, ${addressData[item.id].province}`
                                       )}
                                    </div>
                                 </div>
                              </div>
                           ))
                        ) : (
                           <div>Không có sân bóng nào!</div>
                        )}
                     </div>
                  </div>
               </div>

               {/* Phân trang */}
               <div className="Pagination">
                  <Pagination
                     align="end"
                     current={currentPage}
                     pageSize={itemsPerPage}
                     total={data.length}
                     onChange={(page) => setCurrentPage(page)}
                  />
               </div>
            </div>
         </div>
         <Footer />
      </>
   );
}
