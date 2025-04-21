import './UserModel.scss';
import { Modal } from 'antd';
import { useState } from 'react';
import { updateBusiness } from '../../../services/business.service';
import { updateUser } from '../../../services/user.service';
import { Message } from '../../../utils/utils';

export function UpdateUserModel({
   isModalOpenUser,
   closeModalUser,
   localUser,
   handleChange,
   setLocalUser
}) {
   const [loading, setLoading] = useState(false)

   let handleUpdateUser = async (e) => {
      e.preventDefault();

      setLoading(true);
      let response = await updateUser(localUser);
      // console.log(response)
      if (response.success) {
         const oldUserData = JSON.parse(localStorage.getItem("user")) || {};
         const updatedUser = response.data;
         const mergedUser = { ...oldUserData, ...updatedUser };

         localStorage.setItem("user", JSON.stringify(mergedUser));

         if (response.token) {
            localStorage.setItem("token", response.token);
         }
         Message("Hoàn tất", "Cập nhật thông tin thành công", "success")
         setLocalUser(mergedUser);
         closeModalUser()
      } else {
         Message("Thất bại", response.message, "error")
         console.error("Lỗi cập nhật:", response.error);
         setLoading(false);
      }
      setLoading(false)
   };

   return (
      <Modal
         title="CẬP NHẬT THÔNG TIN NGƯỜI DÙNG"
         open={isModalOpenUser}
         onCancel={closeModalUser}
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
   )
}

export function UpdateBusinessModel({
   isModalOpenBusiness,
   closeModalBusiness,
   localUser,
   handleChange,
   setLocalUser
}) {
   const [loading, setLoading] = useState(false)

   let handleUpdateBusiness = async (e) => {
      e.preventDefault();
      setLoading(true);

      let response = await updateBusiness(localUser);
      if (response.success) {
         const oldUserData = JSON.parse(localStorage.getItem("user")) || {};
         const updatedUser = response.data;
         const mergedUser = { ...oldUserData, ...updatedUser };

         localStorage.setItem("user", JSON.stringify(mergedUser));

         if (response.token) {
            localStorage.setItem("token", response.token);
         }

         setLocalUser(mergedUser);
         closeModalBusiness()
      } else {
         console.error("Lỗi cập nhật:", response.error);
      }
      setLoading(false);
   };

   return (
      <Modal
         title="CẬP NHẬT THÔNG TIN DOANH NGHIỆP"
         open={isModalOpenBusiness}
         onCancel={closeModalBusiness}
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
   )
}