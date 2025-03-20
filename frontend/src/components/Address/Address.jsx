import { useEffect, useState } from "react";
import axios from "axios";
import { Select } from "antd";


export default function Address({ onSelect }) {
   const API_URL = process.env.REACT_APP_API_PROVINCE;

   const [provinces, setProvinces] = useState([]);
   const [districts, setDistricts] = useState([]);
   const [wards, setWards] = useState([]);
   const [selectedProvince, setSelectedProvince] = useState("");
   const [selectedDistrict, setSelectedDistrict] = useState("");
   const [selectedWard, setSelectedWard] = useState("");

   const [provinceName, setProvinceName] = useState("");
   const [districtName, setDistrictName] = useState("");
   const [wardName, setWardName] = useState("");

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

   const handleChange = (value, name) => {
      let newAddress = {
         address: `${wardName ? wardName + ", " : ""}${districtName ? districtName + ", " : ""}${provinceName}`,
         province: [selectedProvince, provinceName],
         district: [selectedDistrict, districtName],
         ward: [selectedWard, wardName]
      };

      if (name === "province") {
         setSelectedProvince(value);
         setProvinceName(provinces.find(p => p.code === value)?.name || "");
         setSelectedDistrict("");
         setSelectedWard("");
         setDistrictName("");
         setWardName("");

         newAddress = {
            address: provinces.find(p => p.code === value)?.name || "",
            province: [value, provinces.find(p => p.code === value)?.name || ""],
            district: [],
            ward: []
         };
      }

      if (name === "district") {
         setSelectedDistrict(value);
         setDistrictName(districts.find(d => d.code === value)?.name || "");
         setSelectedWard("");
         setWardName("");

         newAddress = {
            ...newAddress,
            address: `${districts.find(d => d.code === value)?.name || ""}, ${provinceName}`,
            district: [value, districts.find(d => d.code === value)?.name || ""],
            ward: []
         };
      }

      if (name === "ward") {
         setSelectedWard(value);
         setWardName(wards.find(w => w.code === value)?.name || "");

         newAddress = {
            ...newAddress,
            address: `${wards.find(w => w.code === value)?.name || ""}, ${districtName}, ${provinceName}`,
            ward: [value, wards.find(w => w.code === value)?.name || ""]
         };
      }

      onSelect(newAddress);
   };

   return (
      <div className="address">
         <Select
            value={selectedProvince}
            onChange={(value) => handleChange(value, "province")}
            placeholder="Chọn Tỉnh - Thành Phố"
            style={{ width: "100%", marginBottom: 10 }}
            options={provinces.map((province) => ({
               value: province.code,
               label: province.name
            }))}
         />

         <Select
            value={selectedDistrict}
            onChange={(value) => handleChange(value, "district")}
            placeholder="Chọn Quận - Huyện"
            style={{ width: "100%", marginBottom: 10 }}
            disabled={!selectedProvince}
            options={districts.map((district) => ({
               value: district.code,
               label: district.name
            }))}
         />

         <Select
            value={selectedWard}
            onChange={(value) => handleChange(value, "ward")}
            placeholder="Chọn Xã - Phường"
            style={{ width: "100%" }}
            disabled={!selectedDistrict}
            options={wards.map((ward) => ({
               value: ward.code,
               label: ward.name
            }))}
         />
      </div>
   );
}
