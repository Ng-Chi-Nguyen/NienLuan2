import { BtnAdd, Search } from "../../components/Button/Button";
import Header from "../../components/Header/Header";
import './Schedule.scss';
import { FaPhoneAlt, FaMapMarkedAlt } from "react-icons/fa";
import { Pagination } from 'antd';
import { useEffect, useState } from "react";
import axios from "axios"; // Dùng axios để gọi API
export default function Schedule() {

   const API_URL = process.env.REACT_APP_API_PROVINCE;

   const [provinces, setProvinces] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [wards, setWards] = useState([]);
   const [selectedProvince, setSelectedProvince] = useState("");
   const [selectedDistrict, setSelectedDistrict] = useState("");

   /*
      - provinces: Lưu danh sách Tỉnh - Thành từ API.
      - districts: Lưu danh sách Quận - Huyện khi người dùng chọn tỉnh.
      - wards: Lưu danh sách Xã - Phường khi người dùng chọn quận.
      - selectedProvince: Lưu ID của tỉnh đang được chọn.
      - selectedDistrict: Lưu ID của quận đang được chọn.
   */


   // Hàm lấy danh sách tỉnh/thành từ API

   /*
      - Hàm này chạy ngay khi component được render (useEffect với dependency [API_URL]).
      - axios.get(${API_URL}/?depth=1) gọi API lấy danh sách tỉnh/thành.
      - Nếu thành công, cập nhật danh sách tỉnh/thành vào state (setProvinces(response.data)).
   */

   useEffect(() => {
      axios.get(`${API_URL}/?depth=1`)
         .then((response) => {
            setProvinces(response.data);
         })
         .catch((error) => {
            console.error("Lỗi khi lấy danh sách tỉnh/thành:", error);
         });
   }, [API_URL]);

   // Gọi API lấy quận/huyện khi chọn tỉnh

   /*
      - Hàm này chạy khi selectedProvince thay đổi.
      - Nếu selectedProvince có giá trị:
      - Gọi API axios.get(${API_URL}/p/${selectedProvince}?depth=2) để lấy danh sách quận/huyện của tỉnh đó.
      - Cập nhật districts bằng dữ liệu từ API (setDistricts(response.data.districts || [])).
      - Nếu không chọn tỉnh nào, districts sẽ được reset về [].
   */

   useEffect(() => {
      if (selectedProvince) {
         axios.get(`${API_URL}/p/${selectedProvince}?depth=2`)
            .then((response) => {
               setDistricts(response.data.districts || []);
            })
            .catch((error) => {
               console.error("Lỗi khi lấy danh sách quận/huyện:", error);
            });
      } else {
         setDistricts([]);
      }
   }, [selectedProvince, API_URL]);

   // Gọi API lấy xã/phường khi chọn quận/huyện
   useEffect(() => {
      if (selectedDistrict) {
         axios.get(`${API_URL}/d/${selectedDistrict}?depth=2`)
            .then((response) => {
               setWards(response.data.wards || []);
            })
            .catch((error) => {
               console.error("Lỗi khi lấy danh sách xã/phường:", error);
            });
      } else {
         setWards([]);
      }
   }, [selectedDistrict, API_URL]);
   return (
      <>
         <Header />
         <div className="SchedulePage">
            <div className="container">
               <div className="row">
                  <div className="left col-xl-2">
                     <h4>Lọc sân bóng</h4>
                     {/* Khi người dùng chọn một tỉnh, selectedProvince sẽ được cập nhật.
                     Khi selectedProvince thay đổi, useEffect sẽ gọi API để lấy danh sách quận/huyện. */}
                     <select
                        value={selectedProvince}
                        onChange={(e) => setSelectedProvince(e.target.value)}
                     >
                        <option>Chọn Tỉnh - Thành Phố</option>
                        {provinces.map((province) => (
                           <option key={province.code} value={province.code}>
                              {province.name}
                           </option>
                        ))}
                     </select>
                     <select
                        value={selectedDistrict}
                        onChange={(e) => setSelectedDistrict(e.target.value)}
                     >
                        <option>Chọn Quận - Huyện</option>
                        {districts.map((district) => (
                           <option key={district.code} value={district.code}>
                              {district.name}
                           </option>
                        ))}
                     </select>
                     <select>
                        <option>Chọn Xã - Phường</option>
                        {wards.map((ward) => (
                           <option key={ward.code} value={ward.code}>
                              {ward.name}
                           </option>
                        ))}
                     </select>
                  </div>
                  <div className="right col-xl-10">
                     <div className="mg-r row justify-content-center">
                        <Search name="Tìm sân bóng" />
                     </div>
                     <h2 className="text-center">Bãi sân</h2>
                     <div className="row">
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn_add_FF"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn_add_FF"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn_add_FF"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn_add_FF"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn_add_FF"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn_add_FF"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn_add_FF"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                        <div className="Box">
                           <div className="name">Sân Bóng Việt Hùng Đông Hương</div>
                           <div className="phone"><span><FaPhoneAlt /></span> <p>012346789</p></div>
                           <div className="address"><span><FaMapMarkedAlt /></span><p>Cần Thơ</p></div>
                           <div className="btn_add_FF"> <BtnAdd name="Chi tiết" /></div>
                        </div>
                     </div>
                  </div>
               </div>
               <Pagination align="end" defaultCurrent={1} total={50} />
            </div>
         </div >
      </>
   );
}
