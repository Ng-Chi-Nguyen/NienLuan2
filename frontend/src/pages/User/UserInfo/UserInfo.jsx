import './UserInfo.scss';
import LogoUser from "../../../assets/logo-user.jpg";
import LogoUserFemale from "../../../assets/avatar-user-female.png";
import Avatar from "../../../assets/avatar-business.png";
import axios from "axios";
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
import { EditOutlined, DeleteOutlined, KeyOutlined } from '@ant-design/icons';

import { FloatButton, Modal } from 'antd';


export default function UserInfo({ user }) {

   const [localUser, setLocalUser] = useState(user);
   const [isModalOpen, setIsModalOpen] = useState(false);
   const [loading, setLoading] = useState(false);

   const date = new Date(localUser.created_at).toLocaleDateString("vi-VN");
   const established_date = new Date(localUser.established_date).toLocaleDateString("vi-VN");

   const showModal = () => {
      setIsModalOpen(true);
   };

   const handleCancel = () => {
      setIsModalOpen(false);
   };

   const handleChange = (e) => {
      let { name, value } = e.target;

      // Chuyển đổi kiểu dữ liệu
      if (name === "phone") {
         value = value.replace(/\D/g, ""); // Chỉ giữ số cho phone
      }

      setLocalUser((prev) => ({ ...prev, [name]: value }));
   };

   let handleUpdateUser = async (e) => {
      e.preventDefault();
      // console.log("Dữ liệu form trước khi gửi:", user);
      // console.log("Token trước khi cập nhật:", localStorage.getItem("token"));
      if (!localUser.id) {
         console.error("Lỗi: Không có ID người dùng!");
         return;
      }
      setLoading(true);

      try {
         let id = localUser.id;
         let response = await axios.post(`/api/user/${id}`, {
            name: localUser.name || "",
            phone: localUser.phone || "",
            email: localUser.email || "",
            address: localUser.address || "",
            gender: localUser.gender ?? null
         });

         // console.log("Dữ liệu trả về từ API:", response.data);

         if (response.data.success) {
            // Lấy dữ liệu cũ để giữ lại các thuộc tính không thay đổi
            const oldUserData = JSON.parse(localStorage.getItem("user")) || {};

            // Dữ liệu mới từ API
            const updatedUser = response.data.data;

            // Gộp dữ liệu cũ + mới
            const mergedUser = { ...oldUserData, ...updatedUser };

            // Xóa dữ liệu cũ và thay bằng user mới
            // localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(mergedUser));

            // console.log("User sau khi cập nhật:", mergedUser);

            // Kiểm tra & cập nhật token nếu có
            if (response.data.token) {
               // console.log("Token mới từ API:", response.data.token);
               localStorage.setItem("token", response.data.token);
            }

            // console.log("Token sau khi cập nhật:", localStorage.getItem("token"));

            // Cập nhật state để re-render
            setLocalUser(mergedUser);

            // Gọi lại API để chắc chắn dữ liệu mới đã cập nhật
            handleCancel();
         } else {
            console.error("Lỗi cập nhật:", response.data.error);
         }
      } catch (e) {
         console.error("Lỗi khi cập nhật user:", e);
      }
      setLoading(false);
   };

   let handleUpdateBusiness = async (e) => {
      e.preventDefault();
      // console.log("Dữ liệu form trước khi gửi:", user);
      // console.log("Token trước khi cập nhật:", localStorage.getItem("token"));
      if (!localUser.id) {
         console.error("Lỗi: Không có ID người dùng!");
         return;
      }
      setLoading(true);
      try {
         let id = localUser.id;
         let response = await axios.post(`/api/business/${id}`, {
            name: localUser.name || "",
            phone: localUser.phone || "",
            email: localUser.email || "",
            owner_name: localUser.owner_name || "",
            address: localUser.address || "",
         });

         // console.log("Dữ liệu trả về từ API:", response.data);

         if (response.data.success) {
            // Lấy dữ liệu cũ để giữ lại các thuộc tính không thay đổi
            const oldUserData = JSON.parse(localStorage.getItem("user")) || {};

            // Dữ liệu mới từ API
            const updatedUser = response.data.data;

            // Gộp dữ liệu cũ + mới
            const mergedUser = { ...oldUserData, ...updatedUser };

            // Xóa dữ liệu cũ và thay bằng user mới
            // localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(mergedUser));

            // console.log("User sau khi cập nhật:", mergedUser);

            // Kiểm tra & cập nhật token nếu có
            if (response.data.token) {
               // console.log("Token mới từ API:", response.data.token);
               localStorage.setItem("token", response.data.token);
            }

            // console.log("Token sau khi cập nhật:", localStorage.getItem("token"));

            // Cập nhật state để re-render
            setLocalUser(mergedUser);

            // Gọi lại API để chắc chắn dữ liệu mới đã cập nhật
            handleCancel();
         } else {
            console.error("Lỗi cập nhật:", response.data.error);
         }
      } catch (e) {
         console.error("Lỗi khi cập nhật user:", e);
      }
      setLoading(false);
   }

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
                     onClick={showModal}
                  />
                  <FloatButton icon={<DeleteOutlined className="co-red" />} tooltip="Xóa" />
                  <FloatButton icon={<KeyOutlined />} tooltip="Đổi mật khẩu" />
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
               <Modal
                  title="CẬP NHẬT THÔNG TIN NGƯỜI DÙNG"
                  open={isModalOpen}
                  onCancel={handleCancel} // Cho phép bấm ra ngoài để tắt modal
                  footer={null} // Ẩn nút OK và Cancel
                  maskClosable={true} // Cho phép click bên ngoài để đóng
               >
                  <form onSubmit={handleUpdateUser}>
                     <div className="row model-edit">
                        <div className="item">
                           <label>Tên người dùng</label>
                           <input
                              type="text"
                              name="name"
                              placeholder="Tên người dùng"
                              value={localUser.name}
                              onChange={handleChange}
                           />
                        </div>
                        <div className="item">
                           <label>Số điện thoại</label>
                           <input
                              type="tel"
                              name="phone"
                              placeholder="Số điện thoại"
                              value={localUser.phone}
                              onChange={handleChange}
                           />
                        </div>
                        <div className="item">
                           <label>Địa chỉ</label>
                           <input
                              type="text"
                              name="address"
                              placeholder="Địa chỉ"
                              value={localUser.address}
                              onChange={handleChange}
                           />
                        </div>
                        <div className="item">
                           <label>Giới tính</label>
                           <select name="gender" onChange={handleChange} value={localUser.gender === null ? "unset" : localUser.gender.toString()}>
                              <option value="unset" disabled>Chưa cập nhật</option>
                              <option value="true">Nam</option>
                              <option value="false">Nữ</option>
                           </select>

                        </div>
                        <div className="submit">
                           <button type="submit" className="btn-submit" disabled={loading}>
                              {loading ? "Đang cập nhật..." : "Cập nhật"}
                           </button>
                        </div>
                     </div>
                  </form>
               </Modal>
            </div>
         ) : (
            <div className="modelUpdateBusiness">
               <Modal
                  title="CẬP NHẬT THÔNG TIN DOANH NGHIỆP"
                  open={isModalOpen}
                  onCancel={handleCancel} // Cho phép bấm ra ngoài để tắt modal
                  footer={null} // Ẩn nút OK và Cancel
                  maskClosable={true} // Cho phép click bên ngoài để đóng
               >
                  <form onSubmit={handleUpdateBusiness}>
                     <div className="row model-edit model-edit-business">
                        <div className="item">
                           <label>Tên chủ doanh nghiệp</label>
                           <input
                              type="text"
                              name="name"
                              placeholder="Tên chủ doanh nghiệp"
                              value={localUser.name}
                              onChange={handleChange}
                           />
                        </div>
                        <div className="item">
                           <label>Số điện thoại</label>
                           <input
                              type="tel"
                              name="phone"
                              placeholder="Số điện thoại"
                              value={localUser.phone}
                              onChange={handleChange}
                           />
                        </div>
                        <div
                           className="item"
                           style={{
                              width: localUser.type === "business" ? "calc(100%  - 10px)" : "",
                           }}
                        >
                           <label>Tên doanh nghiệp</label>
                           <input
                              type="text"
                              name="owner_name"
                              placeholder="Tên doanh nghiệp"
                              value={localUser.owner_name}
                              onChange={handleChange}
                           />
                        </div>
                        <div className="item"
                           style={{
                              width: localUser.type === "business" ? "calc(100%  - 10px)" : "",
                           }}
                        >
                           <label>Địa chỉ</label>
                           <input
                              type="text"
                              name="address"
                              placeholder="Địa chỉ"
                              value={localUser.address}
                              onChange={handleChange}
                           />
                        </div>
                        <div className="submit">
                           <button type="submit" className="btn-submit" disabled={loading}>
                              {loading ? "Đang cập nhật..." : "Cập nhật"}
                           </button>
                        </div>
                     </div>
                  </form>
               </Modal>
            </div>
         )}
      </>
   );
}
