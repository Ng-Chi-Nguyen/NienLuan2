import './FoolbalField.scss';

import { useState, useEffect } from 'react';
import { FaRegCheckCircle, FaRegEdit } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { CiNoWaitingSign } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";



import { Modal, InputNumber, Select, Input } from 'antd';


export default function FoolbalField({ user }) {

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [data, setData] = useState([]);

   useEffect(() => {
      const fetchDataFoolbalField = async () => {
         try {
            const response = await fetch(`/api/foolbalField/${user.id}`);
            const result = await response.json();

            // console.log("Dữ liệu từ API:", result.data); // Kiểm tra dữ liệu

            if (result.success) {
               const updatedData = result.data.map((item, index) => ({
                  ...item,
                  key: item.id || index.toString(),
               }));
               setData(updatedData);
            } else {
               console.error("Lỗi:", result.message);
            }
         } catch (error) {
            console.error("Lỗi kết nối API:", error);
         }
      };

      if (user.id) {
         fetchDataFoolbalField();
      }
   }, [user.id]);

   const showModal = () => {
      setIsModalOpen(true);
   };

   const handleCancel = () => {
      setIsModalOpen(false);
   };

   let hangCreateFollbalField = (e) => {
      e.preventDefault();
      showModal()
   }
   return (
      <div className="FoolbalField">
         <p className='title'>Bãi sân của tôi</p>
         <div className="addFF" onClick={hangCreateFollbalField}>
            <button><IoAddOutline /></button><span>Thêm sân bóng</span>
         </div>
         <Modal
            title="THÊM SÂN BÓNG"
            open={isModalOpen}
            onCancel={handleCancel} // Cho phép bấm ra ngoài để tắt modal
            footer={null} // Ẩn nút OK và Cancel
            maskClosable={true} // Cho phép click bên ngoài để đóng
         >
            <form action="">
               <div className="item">
                  <label>Tên sân bóng</label>
                  <Input />
               </div>
               <div className="item">
                  <Select
                     defaultValue="Sân 5"
                     style={{ width: 120 }}
                     options={[
                        { value: '5', label: 'Sân 5' },
                        { value: '7', label: 'Sân 7' },
                        { value: '11', label: 'Sân 11 ' },
                     ]}
                  />
               </div>
               <div className="item">
                  <InputNumber min={1} defaultValue={1} changeOnWheel />
               </div>
               <div className="item">
                  <Input />
               </div>
               <div className="item">
                  <label>Địa chỉ</label>
                  <Input />
               </div>
               <div className="item">
                  <Select
                     defaultValue="Mở"
                     style={{ width: 120 }}
                     options={[
                        { value: 'true', label: 'Mở' },
                        { value: 'false', label: 'Đóng' }
                     ]}
                  />
               </div>
               <div className="item">
                  <input type="file" multiple accept="image/*" />
               </div>
               <div className="item">
                  <button type='submit'>Thêm thoi</button>
               </div>
            </form>
         </Modal>
         <div className="table-container">
            <table>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Tên sân</th>
                     <th>Loại</th>
                     <th>Giá</th>
                     <th>Địa chỉ sân</th>
                     <th>TT</th>
                     <th>Ảnh mô tả</th>
                     <th>Ngày tạo</th>
                     <th>Action</th>
                  </tr>
               </thead>
               <tbody>
                  {data.map((item) => (
                     <tr key={item.key}>
                        <td className='text-center'>{item.id}</td>
                        <td>{item.name}</td>
                        <td className='text-center'>{item.size}</td>
                        <td>{item.price}</td>
                        <td>{item.address}</td>
                        <td>{(item.status) ? (<FaRegCheckCircle />) : (<CiNoWaitingSign />
                        )}</td>
                        <td className='text-center'>Xem ảnh</td>
                        <td className='text-center'>{new Date(item.created_at).toLocaleDateString("vi-VN")}</td>
                        <td className='action'>
                           <button><FaRegEdit /></button>
                           <button><MdOutlineDeleteOutline /></button>
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>
   );
}
