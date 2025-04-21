import './UserInfo.scss';

import LogoUser from "../../../assets/logo-user.jpg";
import LogoUserFemale from "../../../assets/avatar-user-female.png";
import Avatar from "../../../assets/avatar-business.png";

import { useState } from "react";

import { CiUser } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import { SlScreenSmartphone } from "react-icons/sl";
import { PiMapPinArea } from "react-icons/pi";
import { IoBusinessOutline } from "react-icons/io5";
import { FaBarcode } from "react-icons/fa";
import { RxIdCard } from "react-icons/rx";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import { AiOutlineSetting } from "react-icons/ai";
import { EditOutlined } from '@ant-design/icons';
// import { DeleteOutlined, KeyOutlined } from '@ant-design/icons';

import { FloatButton } from 'antd';

import { useModal } from '../../../components/hooks/useModel';

import { UpdateBusinessModel, UpdateUserModel } from '../../../components/Model/User/UserModel';

export default function UserInfo({ user }) {

   const { showModal: openModalUser, hideModal: closeModalUser, isOpen: isModalOpenUser } = useModal();
   const { showModal: openModalBusiness, hideModal: closeModalBusiness, isOpen: isModalOpenBusiness } = useModal();

   const [localUser, setLocalUser] = useState(user);

   const date = new Date(localUser.created_at).toLocaleDateString("vi-VN");
   const established_date = new Date(localUser.established_date).toLocaleDateString("vi-VN");


   const handleChange = (e) => {
      let { name, value } = e.target;

      // Chuyển đổi kiểu dữ liệu
      if (name === "phone") {
         value = value.replace(/\D/g, ""); // Chỉ giữ số cho phone
      }

      setLocalUser((prev) => ({ ...prev, [name]: value }));
   };


   // console.log(localUser.gender)

   return (
      <>
         <div className="infoUser row">
            <h4 className="title-user">
               {(localUser.type === "user") ? <p>Thông tin người dùng</p> : (<p>Thông tin doanh ngiệp</p>)}
            </h4>
            <div className="edit">
               <FloatButton.Group
                  trigger="click"
                  style={{
                     position: "absolute",
                     top: localUser.type === "business" ? 320 : 185,
                     right: 20, // Cách phải 10px
                  }}
                  icon={<AiOutlineSetting />}
               >
                  <FloatButton
                     icon={<EditOutlined className="co-orange" />}
                     tooltip="Sửa"
                     onClick={localUser.type === "user" ? openModalUser : openModalBusiness}
                  />
                  {/* <FloatButton icon={<DeleteOutlined className="co-red" />} tooltip="Xóa" />
                  <FloatButton icon={<KeyOutlined />} tooltip="Đổi mật khẩu" /> */}
               </FloatButton.Group>
            </div>
            <div className="left">
               <div className="logo">
                  {(user.type === "user") ? (
                     <>
                        <img
                           src={localUser?.avatar_url || (localUser?.gender === "female" ? LogoUserFemale : LogoUser)}
                           alt="User Avatar"
                        />
                     </>
                  ) : (
                     <>
                        <img
                           src={localUser.avatar_url ? localUser.avatar_url : Avatar}
                           alt="Business Avatar"
                        />
                     </>
                  )}
               </div>
            </div>
            <div className="right">
               <div className="info-item">
                  <span data-tooltip="Họ và tên"><CiUser /></span>
                  <p>{localUser.name}</p>
               </div>
               <div className="info-item">
                  <span data-tooltip="Email"><TfiEmail /></span>
                  <p>{localUser.email}</p>
               </div>
               <div className="info-item">
                  <span data-tooltip="Số điện thoại"><SlScreenSmartphone /></span>
                  <p>{localUser.phone}</p>
               </div>
               <div className="info-item">
                  <span data-tooltip="Địa chỉ"><PiMapPinArea /></span>
                  <p>{localUser.address}</p>
               </div>
               {(localUser.type === "business") ?
                  <>
                     <div className="info-item">
                        <span data-tooltip="Tên doanh nghiệp"><IoBusinessOutline /></span>
                        <p>{localUser.owner_name}</p>
                     </div>
                     <div className="info-item">
                        <span data-tooltip="Mã số thuế"><FaBarcode /></span>
                        <p>{localUser.tax_code}</p>
                     </div>
                     <div className="info-item">
                        <span data-tooltip="Số giấy phép kinh doanh"><RxIdCard /></span>
                        <p>{localUser.license_number}</p>
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
         {user.type === "user" ? (
            <div>
               <UpdateUserModel
                  isModalOpenUser={isModalOpenUser}
                  closeModalUser={closeModalUser}
                  localUser={localUser}
                  handleChange={handleChange}
                  setLocalUser={setLocalUser}
               />
            </div>
         ) : (
            <div className="modelUpdateBusiness">
               <UpdateBusinessModel
                  isModalOpenBusiness={isModalOpenBusiness}
                  closeModalBusiness={closeModalBusiness}
                  localUser={localUser}
                  handleChange={handleChange}
                  setLocalUser={setLocalUser}
               />
            </div>
         )}
      </>
   );
}
