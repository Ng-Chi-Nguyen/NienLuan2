import './FoolbalField.scss';
import axios from "axios";
import { useState, useEffect } from 'react';
import { FaRegCheckCircle, FaRegEdit } from "react-icons/fa";
import { IoAddOutline } from "react-icons/io5";
import { CiNoWaitingSign } from "react-icons/ci";
import { MdOutlineDeleteOutline } from "react-icons/md";
import { Modal, InputNumber, Select, Input } from 'antd';

import { AddressSelector, AddressFetcher } from '../../../components/Address/Address';

import { useNavigate } from "react-router-dom";
export default function FoolbalField({ user }) {

   const navigate = useNavigate();

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

   const [selectedImages, setSelectedImages] = useState([]);
   const [isImageModalOpen, setIsImageModalOpen] = useState(false);

   const [selectedFF, setSelectedFF] = useState(null);

   const [addressData, setAddressData] = useState(null);


   const [name, setName] = useState("");
   const [size, setSize] = useState("5");
   const [price, setPrice] = useState(1);
   const [status, setStatus] = useState("true");
   const [addressDetail, setAddressDetail] = useState("");

   const [imageList, setImageList] = useState(selectedFF?.image || []);

   const [originalFF, setOriginalFF] = useState(null);

   // Lấy dữ liệu sân bóng từ API
   const fetchFootballFields = async () => {
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

   // Lấy dữ liệu sân bóng từ API
   useEffect(() => {
      if (user.id) {
         fetchFootballFields();
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
         setAddressDetail(selectedFF.address || "");

         setProvinceCode(selectedFF.idProvince);
         setDistrictCode(selectedFF.idDistrict);
         setWardCode(selectedFF.idWard);

         // Cập nhật địa chỉ từ selectedFF
         setAddress({
            province: selectedFF.idProvince,
            district: selectedFF.idDistrict,
            ward: selectedFF.idWard,
         });
      }
   }, [selectedFF]);

   useEffect(() => {
      if (selectedFF) {
         setImageList(selectedFF.image || []);
      }
   }, [selectedFF]);

   useEffect(() => {
      if (selectedFF) {
         setOriginalFF({ ...selectedFF }); // Tạo một bản sao độc lập
      }
   }, [selectedFF]);

   // console.log(selectedFF)
   // Hiển thị Modal thêm sân bóng
   const showModal = () => {
      setIsModalOpen(true);
   };

   const handleCancel = () => {
      setIsModalOpen(false);
   };

   const handleCancelEditModal = () => {
      setIsModalEdit(false);

      // Reset các state về giá trị mặc định
      setName("");
      setSize("5");
      setPrice(1);
      setStatus("true");
      setAddressDetail("");
      setSelectedFiles([]);
      setProvinceCode(null);
      setDistrictCode(null);
      setWardCode(null);
      setTimeout(() => {
         setProvinceCode("");
         setDistrictCode("");
         setWardCode("");
      }, 0);
   };
   console.log("After reset - provinceCode:", provinceCode);
   console.log("After reset - districtCode:", districtCode);
   console.log("After reset - wardCode:", wardCode);
   let hangCreateFollbalField = (e) => {
      e.preventDefault();
      showModal();
   };

   // Xử lý khi chọn file
   // const handleFileChange = (event) => {
   //    const files = Array.from(event.target.files);
   //    const newFileObjects = files.map(file => ({
   //       file,
   //       preview: URL.createObjectURL(file)
   //    }));
   //    setSelectedFiles(prevFiles => [...prevFiles, ...newFileObjects]);
   // };

   // // Xóa file
   // const handleRemoveFile = (event, index) => {
   //    event.preventDefault();
   //    setSelectedFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
   // };

   useEffect(() => {
      console.log("🔹 Sau khi reset các trường địa chỉ:", {
         provinceCode,
         districtCode,
         wardCode,
         address
      });
   }, [provinceCode, districtCode, wardCode, address]);
   // Tạo sân bóng mới
   let handleCreateFF = async (e) => {
      e.preventDefault();
      setLoading(true);

      const formData = new FormData();

      // Append all required fields
      formData.append("name", name);
      formData.append("size", size);
      formData.append("price", price);
      formData.append("status", status === "true");
      formData.append("idBusiness", user.id);
      formData.append("idProvince", provinceCode);
      formData.append("idDistrict", districtCode);
      formData.append("idWard", wardCode);
      formData.append("address", addressDetail);

      // Append any files if you have them
      // selectedFiles.forEach(fileObj => {
      //   formData.append("images", fileObj.file);
      // });
      try {
         let response = await axios.post(`/api/foolbalField/`, formData);

         if (response.data.success) {
            setData(prevData => [
               ...prevData,
               {
                  ...response.data.data,
                  key: response.data.data.id || Math.random().toString(36).substr(2, 9)
               }
            ]);

            // Reset form fields
            setName("");
            setSize("5");
            setPrice(1);
            setStatus("true");
            setAddressDetail("");

            setIsModalOpen(false);
            setSelectedFiles([]);
         } else {
            alert(`Lỗi: ${response.data.message}`);
         }
         setLoading(false);
      } catch (error) {
         console.error("Lỗi kết nối API:", error);
         setLoading(false);
      }
   };

   // Xử lý xem ảnh
   const handleShowImages = () => {
      // try {
      //    const imageArray = typeof images === "string" ? JSON.parse(images.replace(/{|}/g, "[").replace(/,/g, '","')) : images;
      //    setSelectedImages(imageArray);
      //    setIsImageModalOpen(true);
      // } catch (error) {
      //    console.error("Lỗi chuyển đổi ảnh:", error);
      //    setSelectedImages([]);
      //    setIsImageModalOpen(true);
      // }
      setIsImageModalOpen(true);
   };


   const hangEditFollbalField = (e, field) => {
      e.preventDefault();
      setSelectedFF(field);
      setIsModalEdit(true);
   };

   const handleUpdateFF = async (e) => {
      e.preventDefault();

      if (!selectedFF) {
         console.log("🔹 Không có dữ liệu sân bóng để cập nhật.");
         return;
      }

      try {
         setLoading(true)
         const response = await axios.post(`/api/foolbalField/${selectedFF.id}`, selectedFF);

         if (response.data.success) {
            console.log("Cập nhật thành công:", response);

            // Cập nhật state mà không cần reload
            setData(prevData => prevData.map(item =>
               item.id === selectedFF.id ? { ...item, ...selectedFF } : item
            ));

            setIsModalEdit(false);
         } else {
            console.error("Lỗi khi cập nhật:", response.data.message);
            alert("Lỗi khi cập nhật: " + response.data.message);
         }
         setLoading(false)
      } catch (error) {
         console.error("Lỗi hệ thống:", error);
         alert("Lỗi hệ thống khi cập nhật sân bóng!");
      }
   };

   const handleDeleteFF = async (id) => {
      if (!window.confirm("Bạn có chắc chắn muốn xóa sân bóng này không?")) return;

      try {
         const response = await axios.delete(`/api/foolbalField/${id}`);
         if (response.data.success) {
            // Xóa khỏi state để cập nhật giao diện ngay lập tức
            setData(prevData => prevData.filter(item => item.id !== id));
         } else {
            alert(`Lỗi: ${response.data.message}`);
         }
      } catch (error) {
         console.error("Lỗi khi xóa sân bóng:", error);
         alert("Lỗi hệ thống khi xóa sân bóng!");
      }
   };


   const handleBookingClickPage = (sanBong) => {
      navigate(`/BookingBusiness/${sanBong.id}`, { state: sanBong });
   };

   const handleSelect = (value) => {
      console.log("Giá trị chọn:", value);
      setSelectedFF(value);
   };
   // console.log("selectedFF", selectedFF)

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
                  <Input name='name' value={name} onChange={(e) => setName(e.target.value)} required />
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
                  <label>Trang thái</label>
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
                     value={{
                        province: provinceCode,
                        district: districtCode,
                        ward: wardCode
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
                  <Input name='address' value={addressDetail} onChange={(e) => setAddressDetail(e.target.value)} required />
               </div>
               {/* <div className="item">
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
               </div> */}
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
                        <tr key={item.id} onClick={() => handleBookingClickPage(item)}>
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
                              e.stopPropagation(); // Chặn sự kiện click vào <tr>
                              handleShowImages();
                           }}>
                              Xem ảnh
                           </td>
                           <td className="text-center">{new Date(item.created_at).toLocaleDateString("vi-VN")}</td>
                           <td className="action">
                              <button onClick={(e) => {
                                 e.stopPropagation(); // Chặn sự kiện click vào <tr>
                                 hangEditFollbalField(e, item);
                              }}>
                                 <FaRegEdit />
                              </button>
                              <button onClick={(e) => {
                                 e.stopPropagation(); // Chặn sự kiện click vào <tr>
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

               <Modal
                  title="CẬP NHẬT SÂN BÓNG"
                  open={isModalEdit}
                  onCancel={handleCancelEditModal}
                  footer={null}
                  maskClosable={true}
                  className="modelEditFF"
               >
                  <form className="formCreateFF" onSubmit={handleUpdateFF} encType="multipart/form-data">
                     {/* Tên sân bóng */}
                     <div className="item">
                        <label>Tên sân bóng</label>
                        <Input
                           name="name"
                           value={selectedFF?.name || ""}
                           onChange={(e) => setSelectedFF({ ...selectedFF, name: e.target.value })}
                           required
                        />
                     </div>

                     {/* Loại sân */}
                     <div className="item">
                        <label>Loại sân</label>
                        <Select
                           value={selectedFF?.size || ""}
                           onChange={(value) => setSelectedFF({ ...selectedFF, size: value })}
                           style={{ width: 120 }}
                           options={[
                              { value: "5", label: "Sân 5" },
                              { value: "7", label: "Sân 7" },
                              { value: "11", label: "Sân 11" },
                           ]}
                        />
                     </div>

                     {/* Giá */}
                     <div className="item">
                        <label>Giá</label>
                        <InputNumber
                           min={1}
                           value={selectedFF?.price || ""}
                           name="price"
                           onChange={(value) => setSelectedFF({ ...selectedFF, price: value })}
                        />
                     </div>

                     {/* Trạng thái */}
                     <div className="item">
                        <label>Trạng thái</label>
                        <Select
                           value={selectedFF?.status ? "true" : "false"}
                           onChange={(value) => setSelectedFF({ ...selectedFF, status: value === "true" })}
                           style={{ width: 120 }}
                           options={[
                              { value: "true", label: "Mở" },
                              { value: "false", label: "Đóng" },
                           ]}
                        />
                     </div>

                     {/* Địa chỉ */}
                     <div className="item">
                        <label>Địa chỉ</label>
                        <AddressSelector
                           defaultValue={{
                              province: selectedFF?.idProvince || "",
                              district: selectedFF?.idDistrict || "",
                              ward: selectedFF?.idWard || "",
                           }}
                           onSelect={(address) => {
                              console.log("Địa chỉ được chọn:", address);
                              setSelectedFF({
                                 ...selectedFF,
                                 idProvince: address.province,
                                 idDistrict: address.district,
                                 idWard: address.ward,
                              });
                           }}
                        />
                     </div>

                     {/* Địa chỉ cụ thể */}
                     <div className="item">
                        <label>Địa chỉ cụ thể</label>
                        <Input
                           name="address"
                           value={selectedFF?.address || ""}
                           onChange={(e) => setSelectedFF({ ...selectedFF, address: e.target.value })}
                           required
                        />
                     </div>

                     {/* Nút cập nhật */}
                     <div className="submit">
                        <button type="submit">{loading ? "Đang xử lý..." : "Cập nhật"}</button>
                     </div>
                  </form>
               </Modal>
            </table>
         </div>
      </div>
   );
}
