import { BtnAdd, Search } from "../../components/Button/Button";
import { AddressSelector } from "../../components/Address/Address";

import Header from "../../components/Header/Header";
import "./Schedule.scss";

// import { FaPhoneAlt, FaMapMarkedAlt } from "react-icons/fa";
// import { Pagination } from "antd";

import { FaUser } from "react-icons/fa";
import { PiMoneyWavyDuotone } from "react-icons/pi";

import { useState, useEffect } from "react";

export default function Schedule() {
   const [address, setAddress] = useState({
      province: "",
      district: "",
      ward: "",
   });

   // const [currentPage, setCurrentPage] = useState(1);
   // const itemsPerPage = 8; // Số lượng sân hiển thị mỗi trang

   // State lưu danh sách sân bóng
   // const [stadiums, setStadiums] = useState([]);

   // // Lấy danh sách sân hiển thị trên trang hiện tại
   // const startIndex = (currentPage - 1) * itemsPerPage;
   // const paginatedStadiums = stadiums.slice(startIndex, startIndex + itemsPerPage);

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
                        <div className="Box">
                           <div className="name"> Sân bóng đá Kim Quý</div>
                           <div className="row">
                              <div className="size">
                                 <p>Sân 7</p> <span><FaUser /></span>
                              </div>
                              <div className="price">
                                 <p>Giá: 200</p>
                                 <span><PiMoneyWavyDuotone /></span>
                                 <p>/1h</p>
                              </div>
                           </div>
                           <div className="address">Địa chỉ: xã Phước Long, huyện Phước Long, Bạc Liêu</div>
                        </div>
                     </div>
                  </div>
               </div>

               {/* Phân trang */}
               {/* <div className="Pagination">
                  <Pagination
                     align="end"
                     current={currentPage}
                     pageSize={itemsPerPage}
                     total={stadiums.length}
                     onChange={(page) => setCurrentPage(page)}
                  />
               </div> */}
            </div>
         </div>
      </>
   );
}
