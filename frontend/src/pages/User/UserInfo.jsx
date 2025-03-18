import { useState } from "react";
import { FloatButton, Modal } from "antd";
import { EditOutlined, DeleteOutlined, KeyOutlined } from "@ant-design/icons";
import { CiUser } from "react-icons/ci";
import { TfiEmail } from "react-icons/tfi";
import { SlScreenSmartphone } from "react-icons/sl";
import { PiMapPinArea } from "react-icons/pi";
import { IoBusinessOutline } from "react-icons/io5";
import { FaBarcode } from "react-icons/fa";
import { RxIdCard } from "react-icons/rx";
import { HiOutlineCalendarDateRange } from "react-icons/hi2";
import LogoUser from "../../assets/logo-user.jpg";
import LogoUserFemale from "../../assets/avatar-user-female.png";
import Avatar from "../../assets/avatar-business.png";
import axios from "axios";

export default function UserCard({ user, setUser }) {
   const [isModalOpen, setIsModalOpen] = useState(false);

   const showModal = () => setIsModalOpen(true);
   const handleCancel = () => setIsModalOpen(false);

   const handleChange = (e) => {
      let { name, value } = e.target;
      if (name === "gender") value = value === "true";
      if (name === "phone") value = value.replace(/\D/g, "");

      setUser((prev) => ({ ...prev, [name]: value }));
   };

   const handleUpdateUser = async (e) => {
      e.preventDefault();
      if (!user.id) return console.error("Lỗi: Không có ID người dùng!");

      try {
         let response = await axios.post(`/api/user/${user.id}`, {
            name: user.name || "",
            phone: user.phone || "",
            email: user.email || "",
            address: user.address || "",
            gender: user.gender ?? null,
         });

         if (response.data.success) {
            const updatedUser = { ...user, ...response.data.data };
            localStorage.setItem("user", JSON.stringify(updatedUser));
            setUser(updatedUser);
            handleCancel();
         } else {
            console.error("Lỗi cập nhật:", response.data.error);
         }
      } catch (e) {
         console.error("Lỗi khi cập nhật user:", e);
      }
   };

   if (!user) return <p>Loading user...</p>;

   const date = new Date(user.created_at).toLocaleDateString("vi-VN");
   const established_date = user.established_date
      ? new Date(user.established_date).toLocaleDateString("vi-VN")
      : "";

   return (
      <div className="infoUser row">
         <h4 className="title-user">
            {user.type === "user" ? "Thông tin người dùng" : "Thông tin doanh nghiệp"}
         </h4>
         <div className="edit">
            <FloatButton.Group trigger="click" style={{ position: "absolute", top: 185, right: 20 }}>
               <FloatButton icon={<EditOutlined />} tooltip="Sửa" onClick={showModal} />
               <FloatButton icon={<DeleteOutlined />} tooltip="Xóa" />
               <FloatButton icon={<KeyOutlined />} tooltip="Đổi mật khẩu" />
            </FloatButton.Group>
         </div>
         <div className="left">
            <div className="logo">
               <img
                  src={user.avatar_url || (user.gender === "female" ? LogoUserFemale : LogoUser)}
                  alt="User Avatar"
               />
            </div>
         </div>
         <div className="right">
            <div className="info-item"><span><CiUser /></span><p>{user.name}</p></div>
            <div className="info-item"><span><TfiEmail /></span><p>{user.email}</p></div>
            <div className="info-item"><span><SlScreenSmartphone /></span><p>{user.phone}</p></div>
            <div className="info-item"><span><PiMapPinArea /></span><p>{user.address}</p></div>
            {user.type === "business" && (
               <>
                  <div className="info-item"><span><IoBusinessOutline /></span><p>{user.owner_name}</p></div>
                  <div className="info-item"><span><FaBarcode /></span><p>{user.tax_code}</p></div>
                  <div className="info-item"><span><RxIdCard /></span><p>{user.license_number}</p></div>
                  <div className="info-item"><span><HiOutlineCalendarDateRange /></span><p>{established_date}</p></div>
               </>
            )}
            <div className="info-item"><p>Ngày tham gia: {date}</p></div>
         </div>

         <Modal title="CẬP NHẬT THÔNG TIN" open={isModalOpen} onCancel={handleCancel} footer={null}>
            <form onSubmit={handleUpdateUser}>
               <div className="row model-edit">
                  <div className="item"><label>Tên người dùng</label><input type="text" name="name" value={user.name} onChange={handleChange} /></div>
                  <div className="item"><label>Số điện thoại</label><input type="tel" name="phone" value={user.phone} onChange={handleChange} /></div>
                  <div className="item"><label>Địa chỉ</label><input type="text" name="address" value={user.address} onChange={handleChange} /></div>
                  <div className="item"><label>Giới tính</label>
                     <select name="gender" onChange={handleChange} value={user.gender?.toString()}>
                        <option value="" disabled>--</option>
                        <option value="true">Nam</option>
                        <option value="false">Nữ</option>
                     </select>
                  </div>
                  <div className="submit"><button type="submit">Cập nhật</button></div>
               </div>
            </form>
         </Modal>
      </div>
   );
}
