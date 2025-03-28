import './FoolbalField.scss';
import axios from "axios";
import { useState, useEffect, useCallback } from 'react';
import { FaRegCheckCircle, FaRegEdit } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { CiNoWaitingSign } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { AddressFetcher } from '../../../components/Address/Address';
import { useNavigate } from "react-router-dom";
import { CreateFootballField, EditFootballField, FootballFieldImages } from '../../../components/Model/Model';

export default function FoolbalField({ user }) {
   const navigate = useNavigate();

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isModalEdit, setIsModalEdit] = useState(false);
   const [data, setData] = useState([]);
   const [addressData, setAddressData] = useState(null);
   const [selectedFF, setSelectedFF] = useState(null);
   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
   const [selectedFieldId, setSelectedFieldId] = useState(null);

   const fetchFootballFields = useCallback(async () => {
      try {
         const response = await fetch(`/api/foolbalField/${user.id}`);
         const result = await response.json();
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
   }, [user.id]);

   useEffect(() => {
      if (user.id) {
         fetchFootballFields();
      }
   }, [user.id, fetchFootballFields]);

   useEffect(() => {
      const fetchAddressData = async () => {
         const newAddressData = {};
         for (const item of data) {
            const { province, district, ward } = await AddressFetcher(
               item.idProvince,
               item.idDistrict,
               item.idWard
            );
            newAddressData[item.id] = { province, district, ward };
         }
         setAddressData(newAddressData);
      };

      if (data.length > 0) {
         fetchAddressData();
      }
   }, [data]);

   const showModal = () => {
      setIsModalOpen(true);
   };

   const handleCancel = () => {
      setIsModalOpen(false);
   };

   const handleCancelEditModal = () => {
      setIsModalEdit(false);
   };

   const hangCreateFollbalField = (e) => {
      e.preventDefault();
      showModal();
   };

   const handleShowImages = (fieldId) => {
      setSelectedFieldId(fieldId);
      setIsImageModalOpen(true);
   };

   const hangEditFollbalField = (e, field) => {
      e.preventDefault();
      setSelectedFF(field);
      setIsModalEdit(true);
   };

   const handleDeleteFF = async (id) => {
      if (!window.confirm("Bạn có chắc chắn muốn xóa sân bóng này không?")) return;

      try {
         const response = await axios.delete(`/api/foolbalField/${id}`);
         if (response.data.success) {
            setData(prevData => prevData.filter(item => item.id !== id));
         } else {
            alert(`Lỗi: ${response.data.message}`);
         }
      } catch (error) {
         console.error("Lỗi khi xóa sân bóng:", error);
         alert("Lỗi hệ thống khi xóa sân bóng!");
      }
   };

   const handleBookingBusinessClickPage = (sanBong) => {
      navigate(`/BookingBusiness/${sanBong.id}`, { state: sanBong });
   };

   return (
      <div className="FoolbalField">
         <p className='title'>Bãi sân của tôi</p>
         <div className="addFF" onClick={hangCreateFollbalField}>
            <button><IoAddOutline /></button><span>Thêm sân bóng</span>
         </div>

         <CreateFootballField
            user={user}
            isModalOpen={isModalOpen}
            handleCancel={handleCancel}
            fetchFootballFields={fetchFootballFields}
            setData={setData}
         />

         <FootballFieldImages
            fieldId={selectedFieldId}
            isImageModalOpen={isImageModalOpen}
            setIsImageModalOpen={setIsImageModalOpen}
         />

         <EditFootballField
            selectedFF={selectedFF}
            isModalEdit={isModalEdit}
            handleCancelEditModal={handleCancelEditModal}
            setData={setData}
         />

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
                  {data && Array.isArray(data) && data.length > 0 ? (
                     data.map((item) => (
                        <tr key={item.id} onClick={() => handleBookingBusinessClickPage(item)}>
                           <td className="text-center">{item.id}</td>
                           <td>{item.name}</td>
                           <td className="text-center">{item.size}</td>
                           <td className="text-center">{item.price}</td>
                           <td>
                              {addressData?.[item.id] ? (
                                 `${item.address}, ${addressData[item.id]?.ward}, ${addressData[item.id]?.district}, ${addressData[item.id]?.province}`
                              ) : ""}
                           </td>
                           <td>{item.status ? <FaRegCheckCircle /> : <CiNoWaitingSign />}</td>
                           <td className="text-center" onClick={(e) => {
                              e.stopPropagation();
                              handleShowImages(item.id);
                           }}>
                              Xem ảnh
                           </td>
                           <td className="text-center">{new Date(item.created_at).toLocaleDateString("vi-VN")}</td>
                           <td className="action">
                              <button onClick={(e) => {
                                 e.stopPropagation();
                                 hangEditFollbalField(e, item);
                              }}>
                                 <FaRegEdit />
                              </button>
                              <button onClick={(e) => {
                                 e.stopPropagation();
                                 handleDeleteFF(item.id);
                              }}>
                                 <MdOutlineDeleteOutline />
                              </button>
                           </td>
                        </tr>
                     ))
                  ) : (
                     <tr>
                        <td colSpan="9" className="text-center">Không có dữ liệu</td>
                     </tr>
                  )}
               </tbody>
            </table>
         </div>
      </div>
   );
}