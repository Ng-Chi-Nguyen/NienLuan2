import { useState, useEffect } from "react";
import axios from "axios";
import { Select } from "antd";

export function AddressSelector({ defaultValue, onSelect }) {
   const [provinces, setProvinces] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [wards, setWards] = useState([]);

   const [selectedProvince, setSelectedProvince] = useState("");
   const [selectedDistrict, setSelectedDistrict] = useState(null);
   const [selectedWard, setSelectedWard] = useState(null);

   useEffect(() => {
      axios.get("/api/address/provinces/")
         .then(response => setProvinces(response.data.data))
         .catch(error => console.error("Lỗi lấy danh sách tỉnh:", error));
   }, []);

   useEffect(() => {
      /*
         Nếu có defaultValue, nó sẽ:
         Set giá trị tỉnh mặc định.
         Gọi API để lấy danh sách huyện tương ứng với tỉnh.
         Sau đó lấy danh sách xã nếu có defaultValue.district.
         Nếu không có defaultValue, reset toàn bộ về trạng thái ban đầu.
      */
      if (defaultValue?.province) {
         setSelectedProvince(defaultValue.province);
         axios.get(`/api/address/districts/${defaultValue.province}`)
            .then(response => {
               setDistricts(response.data.data);
               if (defaultValue?.district) {
                  setSelectedDistrict(defaultValue.district);
                  return axios.get(`/api/address/wards/${defaultValue.district}`);
               }
            })
            .then(response => {
               if (response?.data?.data && defaultValue?.ward) {
                  setWards(response.data.data);
                  setSelectedWard(defaultValue.ward);
               }
            })
            .catch(error => console.error("Lỗi khi tải địa chỉ:", error));
      } else {
         // Nếu defaultValue rỗng, reset toàn bộ
         setSelectedProvince("");
         setSelectedDistrict("");
         setSelectedWard("");
         setDistricts([]);
         setWards([]);
      }
   }, [defaultValue]);

   const handleProvinceChange = (provinceId) => {
      setSelectedProvince(provinceId);
      setSelectedDistrict(null);
      setSelectedWard(null);
      setDistricts([]);
      setWards([]);

      axios.get(`/api/address/districts/${provinceId}`)
         .then(response => setDistricts(response.data.data))
         .catch(error => console.error("Lỗi lấy danh sách huyện:", error));
   };

   const handleDistrictChange = (districtId) => {
      setSelectedDistrict(districtId);
      setSelectedWard(null);
      setWards([]);

      axios.get(`/api/address/wards/${districtId}`)
         .then(response => setWards(response.data.data))
         .catch(error => console.error("Lỗi lấy danh sách xã:", error));
   };

   const handleWardChange = (wardId) => {
      setSelectedWard(wardId);
      onSelect({ province: selectedProvince, district: selectedDistrict, ward: wardId });
   };

   const adminUnitMap = {
      1: "Thành phố", 2: "Tỉnh", 3: "Thành phố", 4: "Thành phố",
      5: "Quận", 6: "Thị xã", 7: "Huyện", 8: "Phường", 9: "Thị trấn", 10: "Xã",
   };



   return (
      <div className="address-selector">
         <Select
            placeholder="Chọn tỉnh"
            style={{ width: 200, marginRight: 10 }}
            value={selectedProvince}
            onChange={handleProvinceChange}
         >
            {provinces.map(province => (
               <Select.Option key={province.code} value={province.code}>
                  {adminUnitMap[province.administrative_unit_id] || "Không xác định"} {province.name}
               </Select.Option>
            ))}
         </Select>

         <Select
            placeholder="Chọn huyện"
            style={{ width: 200, marginRight: 10 }}
            value={selectedDistrict}
            onChange={handleDistrictChange}
            disabled={!selectedProvince}
         >
            {districts.map(district => (
               <Select.Option key={district.code} value={district.code}>
                  {adminUnitMap[district.administrative_unit_id] || "Không xác định"} {district.name}
               </Select.Option>
            ))}
         </Select>

         <Select
            placeholder="Chọn xã"
            style={{ width: 200 }}
            value={selectedWard}
            onChange={handleWardChange}
            disabled={!selectedDistrict}
         >
            {wards.map(ward => (
               <Select.Option key={ward.code} value={ward.code}>
                  {adminUnitMap[ward.administrative_unit_id] || "Không xác định"} {ward.name}
               </Select.Option>
            ))}
         </Select>
      </div>
   );
}


export const AddressFetcher = async (provinceCode, districtCode, wardCode) => {
   try {
      // Lấy tên tỉnh
      const provinceResponse = await axios.get(`/api/address/province/${provinceCode}`);
      const provinceName = provinceResponse.data.name;

      // Lấy tên huyện
      const districtResponse = await axios.get(`/api/address/district/${districtCode}`);
      const districtName = districtResponse.data.name;

      // Lấy tên xã
      const wardResponse = await axios.get(`/api/address/ward/${wardCode}`);
      const wardName = wardResponse.data.name;
      // console.log(provinceName)
      // console.log(districtName)
      // console.log(wardName)
      return {
         province: provinceName,
         district: districtName,
         ward: wardName,
      };
   } catch (error) {
      console.error("Lỗi khi lấy thông tin địa chỉ:", error);
      return {
         province: "Không xác định",
         district: "Không xác định",
         ward: "Không xác định",
      };
   }
};
