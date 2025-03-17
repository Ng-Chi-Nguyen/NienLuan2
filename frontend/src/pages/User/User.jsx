import Header from "../../components/Header/Header";
import LogoUser from "../../assets/logo-user.jpg";
import LogoUserFemale from "../../assets/avatar-user-female.png";
import Avatar from "../../assets/avatar-business.png";
import './User.scss';
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";  //
import { CiUser } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import { SlScreenSmartphone } from "react-icons/sl";
import { PiMapPinArea } from "react-icons/pi";
import { BsGenderFemale, BsGenderMale } from "react-icons/bs";
import { IoBusinessOutline } from "react-icons/io5";
import { FaBarcode } from "react-icons/fa";
import { RxIdCard } from "react-icons/rx";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { AiOutlineSetting } from "react-icons/ai";
import { EditOutlined, DeleteOutlined, KeyOutlined, CustomerServiceOutlined } from '@ant-design/icons';

import { FloatButton } from 'antd';

export default function User() {

   const [user, setUser] = useState(null);
   const navigate = useNavigate();


   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const userData = params.get("user");

      if (token && userData) {
         // ✅ Lưu vào localStorage
         localStorage.setItem("token", token);
         localStorage.setItem("user", userData);

         // ✅ Cập nhật state user
         setUser(JSON.parse(userData));

         // ✅ Xóa token & user khỏi URL
         navigate("/User", { replace: true });
      } else {
         // Nếu không có trên URL, lấy từ localStorage
         const infoUser = localStorage.getItem("user");
         if (infoUser) {
            setUser(JSON.parse(infoUser));
         }
      }
   }, [navigate]);

   if (!user) {
      return <p>Loading user...</p>;
   }

   const date = new Date(user.created_at).toLocaleDateString("vi-VN");
   const established_date = new Date(user.established_date).toLocaleDateString("vi-VN");

   // Dữ liệu bảng đặt sân

   return (
      <>
         <Header />
         <div className="container">
            <div className="userPage">
               <div className="infoUser row">
                  <h4 className="title-user">
                     {(user.type === "user") ? <p>hông tin người dùng</p> : (<p>Thông tin doanh ngiệp</p>)}
                  </h4>
                  <div className="edit">
                     <FloatButton.Group
                        trigger="click"
                        style={{
                           position: "absolute",
                           top: user.type === "business" ? 320 : 185,
                           right: 20, // Cách phải 10px
                        }}
                        icon={<AiOutlineSetting />}
                     >
                        <FloatButton icon={<EditOutlined />} tooltip="Sửa" />
                        <FloatButton icon={<DeleteOutlined />} tooltip="Xóa" />
                        <FloatButton icon={<KeyOutlined />} tooltip="Đổi mật khẩu" />
                     </FloatButton.Group>
                  </div>
                  <div className="left">
                     <div className="logo">
                        {(user.type === "user") ? (
                           <>
                              <div className="info-item-gender">
                                 {user.gender === "female" ? (
                                    <span className="co-pink"><BsGenderFemale /></span>
                                 ) : (
                                    <span className="co-blue"><BsGenderMale /></span>
                                 )}
                              </div>
                              <img
                                 src={user.avatar_url ? user.avatar_url : (user.gender === "female" ? LogoUserFemale : LogoUser)}
                                 alt="User Avatar"
                              />
                           </>
                        ) : (
                           <>
                              <div className="info-item-gender">
                                 <span className="co-yelow"><IoBusinessOutline /></span>
                              </div>
                              <img
                                 src={user.avatar_url ? user.avatar_url : Avatar}
                                 alt="Business Avatar"
                              />
                           </>
                        )}
                     </div>
                  </div>
                  <div className="right">
                     <div className="info-item">
                        <span data-tooltip="Họ và tên"><CiUser /></span>
                        <p>{user.name}</p>
                     </div>
                     <div className="info-item">
                        <span data-tooltip="Email"><TfiEmail /></span>
                        <p>{user.email}</p>
                     </div>
                     <div className="info-item">
                        <span data-tooltip="Số điện thoại"><SlScreenSmartphone /></span>
                        <p>{user.phone}</p>
                     </div>
                     <div className="info-item">
                        <span data-tooltip="Địa chỉ"><PiMapPinArea /></span>
                        <p>{user.address}</p>
                     </div>
                     {(user.type === "business") ?
                        <>
                           <div className="info-item">
                              <span data-tooltip="Tên doanh nghiệp"><IoBusinessOutline /></span>
                              <p>{user.owner_name}</p>
                           </div>
                           <div className="info-item">
                              <span data-tooltip="Mã số thuế"><FaBarcode /></span>
                              <p>{user.tax_code}</p>
                           </div>
                           <div className="info-item">
                              <span data-tooltip="Số giấy phép kinh doanh"><RxIdCard /></span>
                              <p>{user.license_number}</p>
                           </div>
                           <div className="info-item">
                              <span data-tooltip="Ngày đăng ký doanh nghiệp"><HiOutlineCalendarDateRange /></span>
                              <p>{established_date}</p>
                           </div>
                        </>
                        : (
                           <>
                           </>
                        )}
                     <div className="info-item">
                        <p>Ngày tham gia: {date}</p>
                     </div>
                  </div>
               </div>
               <div className="table-booking">
                  <h4 className="title-table">Danh sách đặt chỗ</h4>
               </div>
            </div>
         </div >
      </>
   );
}
