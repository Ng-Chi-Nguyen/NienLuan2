import { useState, useEffect, useCallback } from 'react';
import { Modal, Input, Select, InputNumber, Upload, Button, Image } from "antd";
import { AddressSelector } from '../../Address/Address';
import { UploadOutlined } from "@ant-design/icons";
import axios from 'axios';
import { Message } from '../../../utils/utils';
import './FootballModel.scss';

import { RiCloseLargeLine } from "react-icons/ri";


export function CreateFootballField({
   user,
   isModalOpen,
   handleCancel,
   setData // Ds San bong
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
      //  Ảnh chưa được upload lên server, nhưng ta muốn hiển thị trước (preview) chúng ra giao diện (như ảnh thu nhỏ)
      const newFileList = fileList.map(file => ({
         ...file,
         preview: file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url
      }));

      setFileList(newFileList);
   };

   const handleDelete = (index) => {
      // _ là giá trị hiện tại
      // i là chỉ số trong mảng fileList
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

      const formData = new FormData(); // cho phép gửi dữ liệu văn bản và cả file (ảnh, video...)

      // formData.append("key", value)
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
            //prevData:  dữ liệu cũ (hiện tại)
            setData(prevData => [
               ...prevData,
               {
                  ...response.data.data,
                  key: response.data.data.id || Math.random().toString(36).substr(2, 9)
               }
            ]);

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
            Message("Hoàn thành", "Tạo sân bóng thành công", "success")
         } else {
            handleCancel();
            Message("Lỗi", response.data.message, "error")
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
         console.log("Không có dữ liệu sân bóng để cập nhật.");
         Message("Lỗi", "Không có dữ liệu sân bóng để cập nhật", "error")
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
            Message("Lỗi khi cập nhật", response.data.message, "error")
         }
         Message("Hoàn thành", "Cập nhật sân bóng thành công", "success")
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


   const fetchImages = useCallback(async () => {
      if (!fieldId) return;

      try {
         const response = await axios.get(`/api/foolbalField/${fieldId}/images`);
         // console.log(response.data);
         if (response.data.success) {
            setImages(response.data.image || []);
         } else {
            setImages([]);
         }
      } catch (error) {
         setImages([]);
      }
   }, [fieldId]); // Chỉ thay đổi khi fieldId thay đổi

   const handleUpload = ({ fileList }) => {
      // Giới hạn tối đa 5 ảnh
      if (fileList.length > 5) {
         fileList = fileList.slice(0, 5);
      }

      // Loại bỏ ảnh trùng
      const uniqueFiles = [];
      const fileMap = new Set();

      fileList.forEach(file => {
         const fileName = file.originFileObj?.name || file.url;
         if (!fileMap.has(fileName)) {
            fileMap.add(fileName);
            uniqueFiles.push({
               ...file,
               preview: file.originFileObj ? URL.createObjectURL(file.originFileObj) : file.url
            });
         }
      });

      setFileList(uniqueFiles);
   };


   const handleDelete = (index) => {
      const newList = fileList.filter((_, i) => i !== index);
      setFileList([...newList]);
   };

   const handleUploadFiles = async () => {
      if (!fieldId || fileList.length === 0) return;
      setLoading(true);

      const formData = new FormData();
      fileList.forEach(file => {
         formData.append("images", file.originFileObj);
      });

      try {
         const response = await axios.post(`/api/foolbalField/${fieldId}/images`, formData);
         if (response.data.success) {
            setFileList([]);    // Xóa danh sách file tạm thời
            setImages([]);      // Reset images để tránh lỗi hiển thị cũ
            await fetchImages(); // Lấy danh sách ảnh mới từ server
            setIsImageModalOpen(false); // Đóng modal
         }
      } catch (error) {
         console.error("Lỗi tải ảnh:", error);
      } finally {
         setLoading(false);
      }
   };


   useEffect(() => {
      if (isImageModalOpen) {
         setImages([]);   // Xóa ảnh cũ
         setFileList([]); // Xóa danh sách file
         fetchImages();   // Lấy ảnh mới từ API
      }
   }, [fieldId, isImageModalOpen, fetchImages]);

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
               <button onClick={handleUploadFiles} disabled={loading || fileList.length === 0}>
                  {loading ? "Đang tải lên..." : "Tải ảnh lên"}
               </button>
            </div>
         </div>
      </Modal>
   );
}


