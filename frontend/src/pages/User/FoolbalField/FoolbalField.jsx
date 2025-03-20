import './FoolbalField.scss';
import axios from "axios";
import { useState, useEffect } from 'react';
import { FaRegCheckCircle, FaRegEdit } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { CiNoWaitingSign } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { IoMdClose } from "react-icons/io";

import Address from "../../../components/Address/Address";

import { Modal, InputNumber, Select, Input } from 'antd';


export default function FoolbalField({ user }) {

   const [isModalOpen, setIsModalOpen] = useState(false);
   const [data, setData] = useState([]);
   const [selectedFiles, setSelectedFiles] = useState([]);
   const [loading, setLoading] = useState(false)
   const [address, setAddress] = useState({
      province: "",
      district: "",
      ward: "",
   });
   const [size, setSize] = useState("5");
   const [status, setStatus] = useState("true");
   const [price, setPrice] = useState(1);

   const [selectedImages, setSelectedImages] = useState([]);
   const [isImageModalOpen, setIsImageModalOpen] = useState(false);


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

   useEffect(() => {
      return () => {
         selectedFiles.forEach(file => URL.revokeObjectURL(file.preview));
      };
   }, [selectedFiles]);

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

   // Hàm xử lý khi chọn file
   const handleFileChange = (event) => {
      const files = Array.from(event.target.files);
      const newFileObjects = files.map(file => ({
         file,
         preview: URL.createObjectURL(file) // Tạo URL tạm thời
      }));

      // Thêm vào danh sách, không ghi đè
      setSelectedFiles(prevFiles => [...prevFiles, ...newFileObjects]);
   };

   // Hàm xóa file cụ thể
   const handleRemoveFile = (event, index) => {
      event.preventDefault(); // Ngăn reload trang

      setSelectedFiles(prevFiles => {
         // Kiểm tra nếu index hợp lệ
         if (index < 0 || index >= prevFiles.length) return prevFiles;

         // Giải phóng bộ nhớ ảnh bị xóa
         URL.revokeObjectURL(prevFiles[index].preview);

         // Cập nhật danh sách ảnh, loại bỏ ảnh bị xóa
         return prevFiles.filter((_, i) => i !== index);
      });
   };

   let handleCreateFF = async (e) => {
      e.preventDefault();
      setLoading(true);

      const formData = new FormData(e.target);
      formData.delete("price"); // Xóa nếu đã tồn tại
      formData.append("price", price); // Chỉ append 1 lần

      formData.append("size", size);
      formData.append("status", status ?? true);
      formData.append("idBusiness", user.id); // Đảm bảo gửi idBusiness nếu cần

      const formattedAddress = [address.province[1], address.district[1], address.ward[1]];
      formData.append("address", JSON.stringify(formattedAddress));
      // Chuyển file vào FormData
      selectedFiles.forEach(fileObj => {
         formData.append("images", fileObj.file);
      });

      // 🔍 Kiểm tra trước khi gửi
      console.log("🔥 Dữ liệu FormData trước khi gửi:");
      for (let pair of formData.entries()) {
         console.log(pair[0], pair[1]);
      }
      try {
         let response = await axios.post(`/api/foolbalField/`, formData);

         console.log(response)

         console.log(response.data.success)
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




   console.log("🔥 Ảnh từ API:", selectedImages);

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
            <form className='formCreateFF' onSubmit={handleCreateFF} encType="multipart/form-data">
               <div className="item">
                  <label>Tên sân bóng</label>
                  <Input name='name' required />
               </div>
               <div className="item">
                  <label>Loại sân</label>
                  <Select
                     defaultValue={size}
                     onChange={value => setSize(value)} // Cập nhật state
                     style={{ width: 120 }}
                     options={[
                        { value: '5', label: 'Sân 5' },
                        { value: '7', label: 'Sân 7' },
                        { value: '11', label: 'Sân 11 ' },
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
                     onChange={(value) => setPrice(value)} // Cập nhật state khi thay đổi
                  />
               </div>
               <div className="item">
                  <label>Trang thái</label>
                  <Select
                     defaultValue={status}
                     onChange={value => setStatus(value)} // Cập nhật state
                     style={{ width: 120 }}
                     options={[
                        { value: 'true', label: 'Mở' },
                        { value: 'false', label: 'Đóng' }
                     ]}
                  />
               </div>
               <div className="item">
                  <label>Địa chỉ</label>
                  <Address onSelect={setAddress} />
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

                  {/* Danh sách file được chọn */}
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
                  <button type='submit'>{loading ? "Đang xữ lý..." : ("Thêm mới")}</button>
               </div>
            </form>
         </Modal>
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
                        <td>{item.address.join(", ")}</td>
                        <td>{(item.status) ? (<FaRegCheckCircle />) : (<CiNoWaitingSign />)}</td>
                        <td className='text-center' onClick={() => handleShowImages(item.image)}>
                           Xem ảnh
                        </td>
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
