import { useState, useEffect } from 'react';
import { Modal, Input, Select, InputNumber, Upload, Button, Image } from "antd";
import { AddressSelector } from '../Address/Address';
import { UploadOutlined } from "@ant-design/icons";
import axios from 'axios';
import './Model.scss';
import { RiCloseLargeLine } from "react-icons/ri";


export function CreateFootballField({
   user,
   isModalOpen,
   handleCancel,
   setData
}) {
   const [loading, setLoading] = useState(false);
   const [name, setName] = useState("");
   const [size, setSize] = useState("5");
   const [price, setPrice] = useState(1);
   const [status, setStatus] = useState("true");
   const [addressDetail, setAddressDetail] = useState("");
   const [provinceCode, setProvinceCode] = useState("");
   const [districtCode, setDistrictCode] = useState("");
   const [wardCode, setWardCode] = useState("");
   const [fileList, setFileList] = useState([]);

   const handleUpload = ({ fileList }) => {
      if (fileList.length > 5) {
         fileList = fileList.slice(0, 5); // Chỉ lấy 5 ảnh đầu tiên
      }

      // Tạo URL xem trước ảnh
      const newFileList = fileList.map(file => ({
         ...file,
         preview: file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url
      }));

      setFileList(newFileList);
   };

   const handleDelete = (index) => {
      const newList = fileList.filter((_, i) => i !== index);
      setFileList([...newList]); // Cập nhật danh sách mới
   };

   useEffect(() => {
      return () => {
         fileList.forEach(file => file.preview && URL.revokeObjectURL(file.preview));
      };
   }, [fileList]);

   const handleCreateFF = async (e) => {
      e.preventDefault();
      setLoading(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("size", size);
      formData.append("price", price);
      formData.append("status", status === "true");
      formData.append("idBusiness", user.id);
      formData.append("idProvince", provinceCode);
      formData.append("idDistrict", districtCode);
      formData.append("idWard", wardCode);
      formData.append("address", addressDetail);

      fileList.forEach(file => {
         formData.append("images", file.originFileObj);
      });

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
            setProvinceCode("");
            setDistrictCode("");
            setWardCode("");
            setFileList([]);

            handleCancel();
         } else {
            alert(`Lỗi: ${response.data.message}`);
         }
      } catch (error) {
         console.error("Lỗi kết nối API:", error);
      } finally {
         setLoading(false);
      }
   };

   return (
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
                     { value: '11', label: 'Sân 11' }
                  ]}
               />
            </div>
            <div className="item">
               <label>Giá</label>
               <InputNumber min={1} value={price} name="price" onChange={(value) => setPrice(value)} />
            </div>
            <div className="item">
               <label>Trạng thái</label>
               <Select value={status} onChange={value => setStatus(value)} style={{ width: 120 }}
                  options={[
                     { value: 'true', label: 'Mở' },
                     { value: 'false', label: 'Đóng' }
                  ]}
               />
            </div>
            <div className="item">
               <label>Địa chỉ</label>
               <AddressSelector
                  value={{ province: provinceCode, district: districtCode, ward: wardCode }}
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
            <div className="item">
               <label>Hình ảnh</label>
               <Upload
                  multiple
                  beforeUpload={() => false}
                  onChange={handleUpload}
                  showUploadList={false} // Ẩn danh sách file đã chọn
               >
                  <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
               </Upload>

               <div className="preview-images">
                  {fileList.map((file, index) => (
                     <div key={file.uid} className="image-container">
                        <Image
                           src={file.preview}
                           alt="preview"
                           width="100%"
                           height="auto"
                           preview={false}
                        />
                        <button className="delete-btn" onClick={() => handleDelete(index)}>
                           <RiCloseLargeLine />
                        </button>
                     </div>
                  ))}
               </div>
            </div>
            <div className="submit">
               <button type='submit' disabled={loading}>{loading ? "Đang xử lý..." : "Thêm mới"}</button>
            </div>
         </form>
      </Modal>
   );
}


export function EditFootballField({
   selectedFF,
   isModalEdit,
   handleCancelEditModal,
   setData
}) {
   const [loading, setLoading] = useState(false);
   const [localFF, setLocalFF] = useState(selectedFF || {});

   useEffect(() => {
      if (selectedFF) {
         setLocalFF({ ...selectedFF });
      }
   }, [selectedFF]);

   const handleUpdateFF = async (e) => {
      e.preventDefault();

      if (!localFF) {
         console.log("🔹 Không có dữ liệu sân bóng để cập nhật.");
         return;
      }

      try {
         setLoading(true);
         const response = await axios.post(`/api/foolbalField/${localFF.id}`, localFF);

         if (response.data.success) {
            setData(prevData => prevData.map(item =>
               item.id === localFF.id ? { ...item, ...localFF } : item
            ));
            handleCancelEditModal();
         } else {
            console.error("Lỗi khi cập nhật:", response.data.message);
            alert("Lỗi khi cập nhật: " + response.data.message);
         }
      } catch (error) {
         console.error("Lỗi hệ thống:", error);
         alert("Lỗi hệ thống khi cập nhật sân bóng!");
      } finally {
         setLoading(false);
      }
   };

   if (!localFF) return null;

   return (
      <Modal
         title="CẬP NHẬT SÂN BÓNG"
         open={isModalEdit}
         onCancel={handleCancelEditModal}
         footer={null}
         maskClosable={true}
         className="modelEditFF"
      >
         <form className="formCreateFF" onSubmit={handleUpdateFF} encType="multipart/form-data">
            <div className="item">
               <label>Tên sân bóng</label>
               <Input
                  name="name"
                  value={localFF.name || ""}
                  onChange={(e) => setLocalFF({ ...localFF, name: e.target.value })}
                  required
               />
            </div>

            <div className="item">
               <label>Loại sân</label>
               <Select
                  value={localFF.size || ""}
                  onChange={(value) => setLocalFF({ ...localFF, size: value })}
                  style={{ width: 120 }}
                  options={[
                     { value: "5", label: "Sân 5" },
                     { value: "7", label: "Sân 7" },
                     { value: "11", label: "Sân 11" },
                  ]}
               />
            </div>

            <div className="item">
               <label>Giá</label>
               <InputNumber
                  min={1}
                  value={localFF.price || ""}
                  name="price"
                  onChange={(value) => setLocalFF({ ...localFF, price: value })}
               />
            </div>

            <div className="item">
               <label>Trạng thái</label>
               <Select
                  value={localFF.status ? "true" : "false"}
                  onChange={(value) => setLocalFF({ ...localFF, status: value === "true" })}
                  style={{ width: 120 }}
                  options={[
                     { value: "true", label: "Mở" },
                     { value: "false", label: "Đóng" },
                  ]}
               />
            </div>

            <div className="item">
               <label>Địa chỉ</label>
               <AddressSelector
                  defaultValue={{
                     province: localFF.idProvince || "",
                     district: localFF.idDistrict || "",
                     ward: localFF.idWard || "",
                  }}
                  onSelect={(address) => {
                     setLocalFF({
                        ...localFF,
                        idProvince: address.province,
                        idDistrict: address.district,
                        idWard: address.ward,
                     });
                  }}
               />
            </div>

            <div className="item">
               <label>Địa chỉ cụ thể</label>
               <Input
                  name="address"
                  value={localFF.address || ""}
                  onChange={(e) => setLocalFF({ ...localFF, address: e.target.value })}
                  required
               />
            </div>

            <div className="submit">
               <button type="submit">{loading ? "Đang xử lý..." : "Cập nhật"}</button>
            </div>
         </form>
      </Modal>
   );
}


export function FootballFieldImages({
   fieldId,
   isImageModalOpen,
   setIsImageModalOpen
}) {
   const [images, setImages] = useState([]);
   const [fileList, setFileList] = useState([]);
   const [loading, setLoading] = useState(false);
   const [uploading, setUploading] = useState(false);

   const fetchImages = async () => {
      if (!fieldId) return;
      setLoading(true);
      try {
         const response = await axios.get(`/api/foolbalField/${fieldId}/images`);
         console.log(response.data)
         if (response.data.success) {
            setImages(response.data.image || []);
         } else {
            setImages([]);
         }
      } catch (error) {
         setImages([]);
      } finally {
         setLoading(false);
      }
   };

   const handleUpload = ({ fileList }) => {
      if (fileList.length > 5) {
         fileList = fileList.slice(0, 5);
      }
      const newFileList = fileList.map(file => ({
         ...file,
         preview: file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url
      }));
      setFileList(newFileList);
   };

   const handleDelete = (index) => {
      const newList = fileList.filter((_, i) => i !== index);
      setFileList([...newList]);
   };

   const handleUploadFiles = async () => {
      // console.log("fieldId:", fieldId);
      setLoading(true)

      if (!fieldId || fileList.length === 0) return;
      const formData = new FormData();
      fileList.forEach(file => {
         formData.append("images", file.originFileObj);
      });
      setUploading(true);
      try {
         const response = await axios.post(`/api/foolbalField/${fieldId}/images`, formData);
         if (response.data.success) {
            fetchImages(); // Cập nhật danh sách ảnh mới
            setFileList([]); // Xóa danh sách file
            setIsImageModalOpen(false); // 🔥 Đóng modal sau khi tải thành công
         }
      } catch (error) {
         console.error("Lỗi tải ảnh:", error);
      }
   };

   useEffect(() => {
      if (isImageModalOpen) {
         fetchImages();
      }
   }, [fieldId, isImageModalOpen]);

   return (
      <Modal
         title="Ảnh mô tả sân bóng"
         open={isImageModalOpen}
         onCancel={() => setIsImageModalOpen(false)}
         footer={null}
         className="modelEditFF"
      >
         <div className="formCreateFF">
            <div className="preview-images">
               {images.map((img, index) => (
                  < Image key={index} src={`${process.env.REACT_APP_API_URL}${img.image_url}`} alt="Ảnh sân" width={100} height={100} />
               ))}
            </div>

            <Upload
               multiple
               beforeUpload={() => false}
               onChange={handleUpload}
               showUploadList={false}
            >
               <Button icon={<UploadOutlined />}>Chọn ảnh</Button>
            </Upload>

            <div className="preview-images">
               {fileList.map((file, index) => (
                  <div key={file.uid} className="image-container">
                     <Image src={file.preview} alt="preview" width={100} height={100} preview={false} />
                     <button className="delete-btn" onClick={() => handleDelete(index)}>
                        <RiCloseLargeLine />
                     </button>
                  </div>
               ))}
            </div>

            <div className="submit">
               <button onClick={handleUploadFiles} disabled={uploading || fileList.length === 0}>
                  {uploading ? "Đang tải lên..." : "Tải ảnh lên"}
               </button>
            </div>
         </div>
      </Modal>
   );
}
