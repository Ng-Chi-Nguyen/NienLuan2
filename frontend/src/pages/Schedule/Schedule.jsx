import { Search } from "../../components/Button/Button";
import { AddressFetcher } from "../../components/Address/Address";
import { Pagination } from "antd";
import Header from "../../layouts/Header/Header";
import Footer from "../../layouts/Footer/Footer";
import "./Schedule.scss";
import { useNavigate } from "react-router-dom";

import { FaUser } from "react-icons/fa";
import { PiMoneyWavyDuotone } from "react-icons/pi";

import { useState, useEffect } from "react";

import { formatNumber } from "../../utils/utils";

import {
   fetchProvince,
   fetchFootballByProvince,
   fetchDistrict,
   fetchFootballByDistrict,
   fetchWard,
   fetchFootballByWard
} from "../../services/address.service";

export default function Schedule() {

   const [data, setData] = useState([]);
   const [currentPage, setCurrentPage] = useState(1);
   const [addressData, setAddressData] = useState();
   const [images, setImages] = useState([]);

   const [province, setProvince] = useState([]);
   const [district, setDistrict] = useState([]);
   const [ward, setWard] = useState([]);
   const [filteredData, setFilteredData] = useState([]);

   const [searchKeyword, setSearchKeyword] = useState("");

   const navigate = useNavigate();

   const itemsPerPage = 8; // Số lượng sân hiển thị mỗi trang

   // Lấy danh sách sân hiển thị trên trang hiện tại
   const startIndex = (currentPage - 1) * itemsPerPage;
   const paginatedData = (searchKeyword ? filteredData : data).slice(startIndex, startIndex + itemsPerPage);

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

   // Khi tỉnh thay đổi
   useEffect(() => {
      const fetchProvinceData = async () => {
         try {
            const provinces = await fetchProvince();
            if (provinces) {
               // console.log("Dữ liệu tỉnh:", provinces); // Xem dữ liệu tỉnh
               // Giả sử bạn muốn set giá trị của province từ dữ liệu trả về
               setProvince(provinces); // Giả sử bạn lấy tên tỉnh đầu tiên
            }
         } catch (error) {
            console.error("Lỗi khi lấy tỉnh:", error);
         }
      };

      fetchProvinceData();
   }, []);
   // Hàm để lấy giá trị của tỉnh đã chọn
   const handleProvinceChange = async (event) => {
      const idProvince = event.target.value;
      // console.log("Tỉnh đã chọn:", selectedValue);

      if (!idProvince) return;

      try {
         const data = await fetchFootballByProvince(idProvince);
         // console.log("data:", data);

         // Gán dữ liệu mới cho state `data` để hiển thị ra body
         if (data && Array.isArray(data)) {
            const formattedData = data.map((item, index) => ({
               ...item,
               key: item.id || index.toString(),
            }));
            setData(formattedData);

            // Gọi lại fetch hình ảnh cho sân trong tỉnh vừa chọn
            formattedData.forEach(field => {
               if (field.id) fetchImages(field.id);
            });

            // Reset lại trang đầu tiên
            setCurrentPage(1);
         }

         // Sau khi co id Tinh thi lay danh sach cac huyen
         const districts = await fetchDistrict(idProvince);
         setDistrict(districts);

      } catch (error) {
         console.error("Lỗi khi lấy sân theo tỉnh:", error);
      }
   };

   const handleDistrictChange = async (event) => {
      const idDistrict = event.target.value;
      // console.log("Huyen đã chọn:", idDistrict);

      if (!idDistrict) return;

      try {
         const data = await fetchFootballByDistrict(idDistrict);
         // console.log("data:", data);

         // Gán dữ liệu mới cho state `data` để hiển thị ra body
         if (data && Array.isArray(data)) {
            const formattedData = data.map((item, index) => ({
               ...item,
               key: item.id || index.toString(),
            }));
            setData(formattedData);

            // Gọi lại fetch hình ảnh cho sân trong tỉnh vừa chọn
            formattedData.forEach(field => {
               if (field.id) fetchImages(field.id);
            });

            // Reset lại trang đầu tiên
            setCurrentPage(1);
         }
         // Sau khi co id Huyen thi lay danh sach cac xa
         const wards = await fetchWard(idDistrict);
         setWard(wards);

      } catch (error) {
         console.error("Lỗi khi lấy sân theo tỉnh:", error);
      }
   };

   const handleWardChange = async (event) => {
      const idWard = event.target.value;
      console.log(idWard)
      if (!idWard) return;
      try {
         const data = await fetchFootballByWard(idWard);
         // console.log("data:", data);

         // Gán dữ liệu mới cho state `data` để hiển thị ra body
         if (data && Array.isArray(data)) {
            const formattedData = data.map((item, index) => ({
               ...item,
               key: item.id || index.toString(),
            }));
            setData(formattedData);

            // Gọi lại fetch hình ảnh cho sân trong tỉnh vừa chọn
            formattedData.forEach(field => {
               if (field.id) fetchImages(field.id);
            });

            // Reset lại trang đầu tiên
            setCurrentPage(1);
         }


      } catch (error) {
         console.error("Lỗi khi lấy sân theo tỉnh:", error);
      }
   }

   const handleSearch = (e) => {
      const keyword = e.target.value.toLowerCase();
      setSearchKeyword(keyword);

      const filtered = data.filter(item =>
         item.name.toLowerCase().includes(keyword)
      );

      setFilteredData(filtered);
      setCurrentPage(1); // reset lại trang
   };

   const handleResetFilter = async () => {
      try {
         const response = await fetch(`/api/foolbalField/`);
         const result = await response.json();

         if (result.success) {
            const DataFootball = result.data.map((item, index) => ({
               ...item,
               key: item.id || index.toString(),
            }));
            setData(DataFootball);

            // Reset tất cả lọc
            setProvince([]);
            setDistrict([]);
            setWard([]);
            setSearchKeyword("");
            setFilteredData([]);
            setCurrentPage(1);

            // Lấy lại ảnh
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

   return (
      <>
         <Header />
         <div className="SchedulePage">
            <div className="container">
               <div className="row">
                  {/* Bộ lọc sân bóng */}
                  <div className="left col-xl-3">
                     <h4>Lọc sân bóng</h4>
                     <select onChange={handleProvinceChange}>
                        <option value="" >Chọn tỉnh thành</option>
                        {province.map((item, index) => {
                           return (
                              <option key={index} value={item.code}>
                                 {item.full_name}
                              </option>
                           );
                        })}
                     </select>
                     <select onChange={handleDistrictChange}>
                        <option value="" >Chọn huyện quận</option>
                        {district.map((item, index) => {
                           return (
                              <option key={index} value={item.code}>
                                 {item.full_name}
                              </option>
                           );
                        })}
                     </select>
                     <select onChange={handleWardChange}>
                        <option value="" >Chọn xã quận</option>
                        {ward.map((item, index) => {
                           return (
                              <option key={index} value={item.code}>
                                 {item.full_name}
                              </option>
                           );
                        })}
                     </select>
                     <button className="btn btn-outline-secondary mt-2" onClick={handleResetFilter}>
                        Hiển thị tất cả sân bóng
                     </button>
                  </div>

                  {/* Danh sách sân bóng */}
                  <div className="right col-xl-9">
                     <div className="mg-r row justify-content-center">
                        <Search
                           className="search"
                           name="Tìm sân bóng"
                           onChange={handleSearch}
                        />
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
