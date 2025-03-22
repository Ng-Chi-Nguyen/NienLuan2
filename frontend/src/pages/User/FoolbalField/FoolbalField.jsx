import './FoolbalField.scss';
import axios from "axios";
import { useState, useEffect } from 'react';
import { FaRegCheckCircle, FaRegEdit } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { CiNoWaitingSign } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";
import { Modal, InputNumber, Select, Input } from 'antd';

import { AddressSelector, AddressFetcher } from '../../../components/Address/Address';

export default function FoolbalField({ user }) {

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [isModalEdit, setIsModalEdit] = useState(false);
   const [data, setData] = useState([]);
   const [selectedFiles, setSelectedFiles] = useState([]);
   const [loading, setLoading] = useState(false)

   const [provinceCode, setProvinceCode] = useState("");
   const [districtCode, setDistrictCode] = useState("");
   const [wardCode, setWardCode] = useState("");
   const [address, setAddress] = useState({
      province: "",
      district: "",
      ward: "",
   });

   // const [size, setSize] = useState("5");
   // const [status, setStatus] = useState("true");
   // const [price, setPrice] = useState(1);

   const [selectedImages, setSelectedImages] = useState([]);
   const [isImageModalOpen, setIsImageModalOpen] = useState(false);

   const [selectedFF, setSelectedFF] = useState(null);

   const [addressData, setAddressData] = useState(null);


   const [name, setName] = useState("");
   const [size, setSize] = useState("5");
   const [price, setPrice] = useState(1);
   const [status, setStatus] = useState("true");
   const [addressDetail, setAddressDetail] = useState("");

   const [deletedImages, setDeletedImages] = useState([]);

   // Lấy dữ liệu sân bóng từ API
   useEffect(() => {
      const fetchDataFoolbalField = async () => {
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
      };

      if (user.id) {
         fetchDataFoolbalField();
      }
   }, [user.id]);

   useEffect(() => {
      return () => {
         selectedFiles.forEach(file => URL.revokeObjectURL(file.preview));
      };
   }, [selectedFiles]);

   // Lấy thông tin địa phương từ API
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
         // console.log(newAddressData)
      };

      if (data.length > 0) {
         fetchAddressData();
      }
   }, [data]);

   useEffect(() => {
      if (selectedFF) {
         setName(selectedFF.name);
         setSize(selectedFF.size);
         setPrice(selectedFF.price);
         setStatus(selectedFF.status ? "true" : "false");
         setAddressDetail(selectedFF.address);

         // Cập nhật giá trị mặc định cho địa chỉ
         setProvinceCode(selectedFF.idProvince);
         setDistrictCode(selectedFF.idDistrict);
         setWardCode(selectedFF.idWard);
      }
   }, [selectedFF]);


   // Hiển thị Modal thêm sân bóng
   const showModal = () => {
      setIsModalOpen(true);
   };

   const handleCancel = () => {
      setIsModalOpen(false);
   };

   let hangCreateFollbalField = (e) => {
      e.preventDefault();
      showModal();
   };

   // Xử lý khi chọn file
   const handleFileChange = (event) => {
      const files = Array.from(event.target.files);
      const newFileObjects = files.map(file => ({
         file,
         preview: URL.createObjectURL(file)
      }));
      setSelectedFiles(prevFiles => [...prevFiles, ...newFileObjects]);
   };

   // Xóa file
   const handleRemoveFile = (event, index) => {
      event.preventDefault();
      setSelectedFF(prevFF => ({
         ...prevFF,
         image: prevFF.image.filter((_, i) => i !== index),
      }));
   };


   // Tạo sân bóng mới
   let handleCreateFF = async (e) => {
      e.preventDefault();
      setLoading(true);

      const formData = new FormData(e.target);
      formData.delete("price");
      formData.append("price", price);

      formData.append("size", size);
      formData.append("status", status ?? true);
      formData.append("idBusiness", user.id);

      formData.append("idProvince", provinceCode);
      formData.append("idDistrict", districtCode);
      formData.append("idWard", wardCode);

      selectedFiles.forEach(fileObj => {
         formData.append("images", fileObj.file);
      });

      try {
         let response = await axios.post(`/api/foolbalField/`, formData);

         if (response.data.success) {
            setData(prevData => [
               ...prevData,
               { ...response.data.data, key: response.data.data.id || Math.random().toString(36).substr(2, 9) }
            ]);
            setIsModalOpen(false);
            setSelectedFiles([]);
         } else {
            alert(`Lỗi: ${response.data.message}`);
         }
         setLoading(false);
      } catch (error) {
         console.error("Lỗi kết nối API:", error);
      }
   };

   // Xử lý xem ảnh
   const handleShowImages = (images) => {
      try {
         const imageArray = typeof images === "string" ? JSON.parse(images.replace(/{|}/g, "[").replace(/,/g, '","')) : images;
         setSelectedImages(imageArray);
         setIsImageModalOpen(true);
      } catch (error) {
         console.error("Lỗi chuyển đổi ảnh:", error);
         setSelectedImages([]);
         setIsImageModalOpen(true);
      }
   };

   let hangEditFollbalField = (e, field) => {
      e.preventDefault();
      if (!field) {
         console.error("Dữ liệu sân bóng không hợp lệ:", field);
         return;
      }
      console.log("Dữ liệu sân bóng được chọn:", field);
      setSelectedFF(field);
      setIsModalEdit(true);
   };


   const handleUpdateFF = async (e) => {
      e.preventDefault();
      setLoading(true);
   };

   const handleSelect = (value) => {
      console.log("Giá trị chọn:", value);
      setSelectedFF(value);
   };
   console.log("selectedFF", selectedFF)

   return (
      <div className="FoolbalField">
         <p className='title'>Bãi sân của tôi</p>
         <div className="addFF" onClick={hangCreateFollbalField}>
            <button><IoAddOutline /></button><span>Thêm sân bóng</span>
         </div>

         {/* Modal Thêm sân bóng */}
         <Modal
            title="THÊM SÂN BÓNG"
            open={isModalOpen}
            onCancel={handleCancel}
            footer={null}
            maskClosable={true}
            className='modelCreateFF'
         >
            <form className='formCreateFF' onSubmit={handleCreateFF} encType="multipart/form-data">
               <div className="item">
                  <label>Tên sân bóng</label>
                  <Input name='name' required />
               </div>
               <div className="item">
                  <label>Loại sân</label>
                  <Select
                     defaultValue={size}
                     onChange={value => setSize(value)}
                     style={{ width: 120 }}
                     options={[
                        { value: '5', label: 'Sân 5' },
                        { value: '7', label: 'Sân 7' },
                        { value: '11', label: 'Sân 11' },
                     ]}
                  />
               </div>
               <div className="item">
                  <label>Giá</label>
                  <InputNumber
                     min={1}
                     defaultValue={1}
                     changeOnWheel
                     name="price"
                     onChange={(value) => setPrice(value)}
                  />
               </div>
               <div className="item">
                  <label>Trang thái</label>
                  <Select
                     defaultValue={status}
                     onChange={value => setStatus(value)}
                     style={{ width: 120 }}
                     options={[
                        { value: 'true', label: 'Mở' },
                        { value: 'false', label: 'Đóng' }
                     ]}
                  />
               </div>
               <div className="item">
                  <label>Địa chỉ</label>
                  <AddressSelector
                     onSelect={(address) => {
                        setAddress({
                           province: address.province,
                           district: address.district,
                           ward: address.ward,
                        });

                        setProvinceCode(address.province);
                        setDistrictCode(address.district);
                        setWardCode(address.ward);
                     }}
                  />
               </div>
               <div className="item">
                  <label>Địa chỉ cụ thể</label>
                  <Input name='address' required />
               </div>
               <div className="item">
                  <label>Ảnh mô tả</label>
                  <label htmlFor="upload" className="custom-file-upload">
                     Chọn ảnh
                  </label>
                  <input
                     id="upload"
                     type="file"
                     multiple
                     accept="image/*"
                     onChange={handleFileChange}
                  />
                  <div className="file-list">
                     {selectedFiles.length > 0 ? (
                        selectedFiles.map((fileObj, index) => (
                           <div key={fileObj.preview} className="file-item">
                              <img src={fileObj.preview} alt="Ảnh xem trước" className="preview-image" />
                              <button className='btn-del-file' onClick={(e) => handleRemoveFile(e, index)}>
                                 <IoMdClose />
                              </button>
                           </div>
                        ))
                     ) : (
                        <p>Chưa chọn tệp nào</p>
                     )}
                  </div>
               </div>
               <div className="submit">
                  <button type='submit'>{loading ? "Đang xử lý..." : "Thêm mới"}</button>
               </div>
            </form>
         </Modal>

         {/* Modal Xem ảnh */}
         <Modal
            title="Ảnh mô tả sân bóng"
            open={isImageModalOpen}
            onCancel={() => setIsImageModalOpen(false)}
            footer={null}
         >
            <div className="image-preview-container">
               {selectedImages.length > 0 ? (
                  selectedImages.map((image, index) => (
                     <img key={index} src={image} alt={`Ảnh ${index + 1}`} className="preview-image" />
                  ))
               ) : (
                  <p>Không có ảnh nào</p>
               )}
            </div>
         </Modal>

         {/* Table */}
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
                        <tr key={item.key}>
                           <td className='text-center'>{item.id}</td>
                           <td>{item.name}</td>
                           <td className='text-center'>{item.size}</td>
                           <td>{item.price}</td>
                           <td>
                              {addressData && addressData[item.id]
                                 ? `${item.address}, ${addressData[item.id].ward}, ${addressData[item.id].district}, ${addressData[item.id].province}`
                                 : <></>}
                           </td>
                           <td>{(item.status) ? (<FaRegCheckCircle />) : (<CiNoWaitingSign />)}</td>
                           <td className='text-center' onClick={() => handleShowImages(item.image)}>
                              Xem ảnh
                           </td>
                           <td className='text-center'>{new Date(item.created_at).toLocaleDateString("vi-VN")}</td>
                           <td className='action'>
                              <button onClick={(e) => hangEditFollbalField(e, item)}>
                                 <FaRegEdit />
                              </button>
                              <button>
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
               <Modal
                  title="CẬP NHẬT SÂN BÓNG"
                  open={isModalEdit} // Sử dụng isModalEdit thay vì isModalOpen
                  onCancel={() => setIsModalEdit(false)} // Đóng modal khi bấm hủy
                  footer={null}
                  maskClosable={true}
                  className='modelEditFF'
               >
                  <form className='formCreateFF' onSubmit={handleUpdateFF} encType="multipart/form-data">
                     <div className="item">
                        <label>Tên sân bóng</label>
                        <Input name='name' value={selectedFF?.name} required />
                     </div>
                     <div className="item">
                        <label>Loại sân</label>
                        <Select
                           value={size}
                           onChange={value => setSize(value)}
                           style={{ width: 120 }}
                           options={[
                              { value: '5', label: 'Sân 5' },
                              { value: '7', label: 'Sân 7' },
                              { value: '11', label: 'Sân 11' },
                           ]}
                        />
                     </div>
                     <div className="item">
                        <label>Giá</label>
                        <InputNumber
                           min={1}
                           value={price}
                           changeOnWheel
                           name="price"
                           onChange={(value) => setPrice(value)}
                        />
                     </div>
                     <div className="item">
                        <label>Trạng thái</label>
                        <Select
                           value={status}
                           onChange={value => setStatus(value)}
                           style={{ width: 120 }}
                           options={[
                              { value: 'true', label: 'Mở' },
                              { value: 'false', label: 'Đóng' }
                           ]}
                        />
                     </div>
                     <div className="item">
                        <label>Địa chỉ</label>
                        <AddressSelector
                           defaultValue={{
                              province: selectedFF?.idProvince || "",
                              district: selectedFF?.idDistrict || "",
                              ward: selectedFF?.idWard || "",
                           }}
                           onSelect={(address) => {
                              setProvinceCode(address.province);
                              setDistrictCode(address.district);
                              setWardCode(address.ward);
                           }}
                        />

                     </div>
                     <div className="item">
                        <label>Địa chỉ cụ thể</label>
                        <Input
                           name='address'
                           value={selectedFF?.address}
                           required
                        />
                     </div>
                     <div className="item">
                        <label>Ảnh mô tả</label>
                        <input
                           id="upload"
                           type="file"
                           accept="image/*"
                           multiple
                           onChange={handleFileChange}
                        />
                        <div className="image-preview-container">
                           {selectedFF?.image && Array.isArray(selectedFF.image) ? (
                              selectedFF.image.map((img, index) => (
                                 <div key={index} className="file-item">
                                    <img src={img} alt={`Ảnh ${index + 1}`} className="preview-image" />
                                    <button className='btn-del-file' onClick={(e) => handleRemoveFile(e, index)}>
                                       <IoMdClose />
                                    </button>
                                 </div>
                              ))
                           ) : (
                              <p>Không có ảnh nào</p>
                           )}
                        </div>
                     </div>
                     <div className="submit">
                        <button type='submit'>{loading ? "Đang xử lý..." : "Cập nhật"}</button>
                     </div>
                  </form>
               </Modal>

            </table>
         </div>
      </div>
   );
}
