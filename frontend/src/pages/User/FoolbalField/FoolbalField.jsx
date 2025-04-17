import './FoolbalField.scss';
import { useState, useEffect, useCallback } from 'react';
import { FaRegEdit } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { CreateFootballField, EditFootballField, FootballFieldImages } from '../../../components/Model/Football/FootballModel';
import { fetchFootballFieldsAPI } from '../../../services/footballField.service';
import { fetchAddress } from '../../../services/address.service';
import { useModal } from "../../../components/hooks/useModel";
import { Tag } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { formatNumber } from '../../../utils/utils';
export default function FoolbalField({ user }) {
   const navigate = useNavigate();

   const modalCreate = useModal();
   const modalEdit = useModal();
   const modalImages = useModal();

   const [data, setData] = useState([]);
   const [addressData, setAddressData] = useState(null);
   const [selectedFF, setSelectedFF] = useState(null);
   const [selectedFieldId, setSelectedFieldId] = useState(null);

   const fetchFootballFields = useCallback(async () => {
      const updatedData = await fetchFootballFieldsAPI(user.id);
      setData(updatedData);
   }, [user.id]);

   useEffect(() => {
      const fetchAddressData = async () => {
         const newAddressData = {};

         for (const item of data) {
            if (!newAddressData[item.id]) { // Kiểm tra nếu địa chỉ chưa được lấy cho sân này
               const address = await fetchAddress(item.idProvince, item.idDistrict, item.idWard);
               newAddressData[item.id] = address; // Lưu địa chỉ vào object với key là ID của sân
            }
         }
         setAddressData(prev => ({ ...prev, ...newAddressData }));
      };

      if (data.length > 0) {
         fetchAddressData();
      }
   }, [data]);

   useEffect(() => {
      if (user.id) {
         fetchFootballFields();
      }
   }, [user.id, fetchFootballFields]);


   // Show model ket hop voi hook

   const hangCreateFollbalField = (e) => {
      e.preventDefault();
      modalCreate.showModal();
   };

   const hangEditFollbalField = (e, field) => {
      e.preventDefault();
      setSelectedFF(field);
      modalEdit.showModal();
   };

   const handleShowImages = (fieldId) => {
      setSelectedFieldId(fieldId);
      modalImages.showModal();
   };


   // Xoa san bong
   // const DeleteFootball = async (id) => {
   //    const confirmDelete = window.confirm("Bạn có chắc chắn muốn xóa sân bóng này không?");
   //    if (!confirmDelete) return;

   //    const isDeleted = await deleteFootballByID(id);
   //    if (isDeleted) {
   //       setData(prevData => prevData.filter(item => item.id !== id)); // Cập nhật danh sách sau khi xóa
   //    }
   //    Message("Xóa thành công", "Sân bóng đã dược xóa khỏi hệ thống", "success")
   // };


   const handleBookingBusinessClickPage = (sanBong) => {
      navigate(`/BookingBusiness/${sanBong.id}`, { state: sanBong });
   };

   // console.log(addressData)

   return (
      <div className="FoolbalField">
         <p className='title'>Bãi sân của tôi</p>
         <div className="addFF" onClick={hangCreateFollbalField}>
            <button><IoAddOutline /></button><span>Thêm sân bóng</span>
         </div>
         <div className="table-container">
            <table>
               <thead>
                  <tr>
                     <th>ID</th>
                     <th>Tên sân</th>
                     <th>Loại</th>
                     <th>Giá (vnđ)</th>
                     <th>Địa chỉ sân</th>
                     <th>Trạng thái</th>
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
                           <td className="text-center">{formatNumber(item.price)}</td>
                           <td>
                              {addressData?.[item.id] ? `${item.address}, ${addressData[item.id]}` : "Đang tải..."}
                           </td>
                           <td>
                              {item.status ?
                                 <Tag icon={<CheckCircleOutlined />} color="success">
                                    Đang mở
                                 </Tag>
                                 :
                                 <Tag icon={<CloseCircleOutlined />} color="error">
                                    Đang đóng
                                 </Tag>
                              }
                           </td>
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
                              {/* <button onClick={(e) => {
                                 e.stopPropagation();
                                 DeleteFootball(item.id);
                              }}>
                                 <MdOutlineDeleteOutline />
                              </button> */}
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
         <CreateFootballField
            user={user}
            isModalOpen={modalCreate.isOpen}
            handleCancel={modalCreate.hideModal}
            fetchFootballFields={fetchFootballFields}
            setData={setData}
         />

         <FootballFieldImages
            fieldId={selectedFieldId}
            isImageModalOpen={modalImages.isOpen}
            setIsImageModalOpen={modalImages.hideModal}
         />

         <EditFootballField
            selectedFF={selectedFF}
            isModalEdit={modalEdit.isOpen}
            handleCancelEditModal={modalEdit.hideModal}
            setData={setData}
         />
      </div>
   );
}