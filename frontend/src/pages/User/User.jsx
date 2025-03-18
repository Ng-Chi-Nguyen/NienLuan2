import Header from "../../components/Header/Header";
import LogoUser from "../../assets/logo-user.jpg";
import LogoUserFemale from "../../assets/avatar-user-female.png";
import Avatar from "../../assets/avatar-business.png";
import './User.scss';


import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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

export default function User() {

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [user, setUser] = useState(null);
   const navigate = useNavigate();


   useEffect(() => {
      const params = new URLSearchParams(window.location.search);
      const token = params.get("token");
      const userData = params.get("user");

      if (token && userData) {
         //  Lưu vào localStorage
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

   // Edit

   const showModal = () => {
      setIsModalOpen(true);
   };
   const handleCancel = () => {
      setIsModalOpen(false);
   };

   const handleChange = (e) => {
      let { name, value } = e.target;

      // Chuyển đổi kiểu dữ liệu
      if (name === "gender") {
         value = value === "true"; // Chuyển thành true/false
      } else if (name === "phone") {
         value = value.replace(/\D/g, ""); // Chỉ giữ số cho phone
      }

      setUser((prev) => ({ ...prev, [name]: value }));
   };

   let handleUpdateUser = async (e) => {
      e.preventDefault();
      console.log("Dữ liệu form trước khi gửi:", user);
      console.log("Token trước khi cập nhật:", localStorage.getItem("token"));
      if (!user.id) {
         console.error("Lỗi: Không có ID người dùng!");
         return;
      }

      try {
         let id = user.id;
         let response = await axios.post(`/api/user/${id}`, {
            name: user.name || "",
            phone: user.phone || "",
            email: user.email || "",
            address: user.address || "",
            gender: user.gender ?? null
         });

         console.log("Dữ liệu trả về từ API:", response.data);

         if (response.data.success) {
            // Lấy dữ liệu cũ để giữ lại các thuộc tính không thay đổi
            const oldUserData = JSON.parse(localStorage.getItem("user")) || {};

            // Dữ liệu mới từ API
            const updatedUser = response.data.data;

            // Gộp dữ liệu cũ + mới
            const mergedUser = { ...oldUserData, ...updatedUser };

            // Xóa dữ liệu cũ và thay bằng user mới
            localStorage.removeItem("user");
            localStorage.setItem("user", JSON.stringify(mergedUser));

            console.log("User sau khi cập nhật:", mergedUser);

            // Kiểm tra & cập nhật token nếu có
            if (response.data.token) {
               console.log("Token mới từ API:", response.data.token);
               localStorage.setItem("token", response.data.token);
            }

            console.log("Token sau khi cập nhật:", localStorage.getItem("token"));

            // Cập nhật state để re-render
            setUser(mergedUser);

            // Gọi lại API để chắc chắn dữ liệu mới đã cập nhật
            handleCancel();
         } else {
            console.error("Lỗi cập nhật:", response.data.error);
         }
      } catch (e) {
         console.error("Lỗi khi cập nhật user:", e);
      }
   };







   console.log(user.avatar_url)

   return (
      <>
         <Header />
         <div className="container">
            <div className="userPage">
               <div className="infoUser row">
                  <h4 className="title-user">
                     {(user.type === "user") ? <p>Thông tin người dùng</p> : (<p>Thông tin doanh ngiệp</p>)}
                  </h4>
                  <div>OK</div>
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
                                 src={user?.avatar_url || (user?.gender === "female" ? LogoUserFemale : LogoUser)}
                                 alt="User Avatar"
                              />
                           </>
                        ) : (
                           <>
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
                           <input
                              type="text"
                              name="name"
                              placeholder="Tên cửa hàng"
                              value={user.name}
                              onChange={handleChange}
                           />
                           <input
                              type="tel"
                              name="phone"
                              placeholder="Số điện thoại"
                              value={user.phone}
                              onChange={handleChange}
                           />
                           <input
                              type="text"
                              name="address"
                              placeholder="Địa chỉ"
                              value={user.address}
                              onChange={handleChange}
                           />
                           <select name="gender" onChange={handleChange} value={user.gender ? user.gender.toString() : ""}>
                              <option value="" disabled>--</option>
                              <option value="true">Nam</option>
                              <option value="false">Nữ</option>
                           </select>

                           <div className="submit">
                              <button type="submit" className="btn-submit">
                                 Cập nhật
                              </button>
                           </div>
                        </div>
                     </form>
                  </Modal>
               </div>

            </div>

         </div >
      </>
   );
}
