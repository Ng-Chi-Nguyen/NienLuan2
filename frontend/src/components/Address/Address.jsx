import { useEffect, useState } from "react";
import axios from "axios";

export default function Address({ onSelect }) {
   const API_URL = process.env.REACT_APP_API_PROVINCE;

   const [provinces, setProvinces] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [wards, setWards] = useState([]);
   const [selectedProvince, setSelectedProvince] = useState("");
   const [selectedDistrict, setSelectedDistrict] = useState("");
   const [selectedWard, setSelectedWard] = useState("");

   useEffect(() => {
      axios.get(`${API_URL}/?depth=1`)
         .then((response) => setProvinces(response.data))
         .catch((error) => console.error("Lỗi lấy danh sách tỉnh:", error));
   }, [API_URL]);

   useEffect(() => {
      if (selectedProvince) {
         axios.get(`${API_URL}/p/${selectedProvince}?depth=2`)
            .then((response) => setDistricts(response.data.districts || []))
            .catch((error) => console.error("Lỗi lấy danh sách quận:", error));
      } else {
         setDistricts([]);
      }
   }, [selectedProvince, API_URL]);

   useEffect(() => {
      if (selectedDistrict) {
         axios.get(`${API_URL}/d/${selectedDistrict}?depth=2`)
            .then((response) => setWards(response.data.wards || []))
            .catch((error) => console.error("Lỗi lấy danh sách xã:", error));
      } else {
         setWards([]);
      }
   }, [selectedDistrict, API_URL]);

   const handleChange = (e) => {
      const { name, value } = e.target;

      if (name === "province") {
         setSelectedProvince(value);
         setSelectedDistrict("");
         setSelectedWard("");
         onSelect({ province: value, district: "", ward: "" });
      }

      if (name === "district") {
         setSelectedDistrict(value);
         setSelectedWard("");
         onSelect({ province: selectedProvince, district: value, ward: "" });
      }

      if (name === "ward") {
         setSelectedWard(value);
         onSelect({ province: selectedProvince, district: selectedDistrict, ward: value });
      }
   };

   return (
      <div className="address">
         <select name="province" value={selectedProvince} onChange={handleChange}>
            <option value="">Chọn Tỉnh - Thành Phố</option>
            {provinces.map((province) => (
               <option key={province.code} value={province.code}>
                  {province.name}
               </option>
            ))}
         </select>

         <select name="district" value={selectedDistrict} onChange={handleChange} disabled={!selectedProvince}>
            <option value="">Chọn Quận - Huyện</option>
            {districts.map((district) => (
               <option key={district.code} value={district.code}>
                  {district.name}
               </option>
            ))}
         </select>

         <select name="ward" value={selectedWard} onChange={handleChange} disabled={!selectedDistrict}>
            <option value="">Chọn Xã - Phường</option>
            {wards.map((ward) => (
               <option key={ward.code} value={ward.code}>
                  {ward.name}
               </option>
            ))}
         </select>
      </div>
   );
}
