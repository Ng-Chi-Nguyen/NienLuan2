import axios from "axios";

export const fetchAddress = async (idProvince, idDistrict, idWard) => {
   try {
      const response = await axios.get(`/api/address/${idProvince}/${idDistrict}/${idWard}`);
      if (response.data.success) {
         return response.data.data; // Trả về dữ liệu địa chỉ
      }
   } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
   }
   return "Không thể tải địa chỉ"; // Trả về chuỗi lỗi nếu request thất bại
};

export const fetchProvince = async () => {
   try {
      const response = await axios.get(`/api/address/provinces/`);
      if (response.data.success) {
         return response.data.data; // Trả về dữ liệu địa chỉ
      }
   } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
   }
   return "Không thể tải địa chỉ"; // Trả về chuỗi lỗi nếu request thất bại
};

export const fetchFootballByProvince = async (idProvince) => {
   console.log("ID tỉnh gọi API:", idProvince);
   try {
      const response = await axios.get(`/api/filter/football/provinces/${idProvince}`);
      // console.log(response)
      if (response.data.success) {
         return response.data.data; // Trả về dữ liệu địa chỉ
      }
   } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
   }
   return "Không thể tải địa chỉ"; // Trả về chuỗi lỗi nếu request thất bại
};

export const fetchDistrict = async (provinces) => {
   // console.log(provinces)
   try {
      const response = await axios.get(`/api/address/districts/${provinces}`);
      if (response.data.success) {
         return response.data.data; // Trả về dữ liệu địa chỉ
      }
   } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
   }
   return "Không thể tải địa chỉ"; // Trả về chuỗi lỗi nếu request thất bại
};

export const fetchFootballByDistrict = async (idDistrict) => {
   // console.log("ID tỉnh gọi API:", idDistrict);
   try {
      const response = await axios.get(`/api/filter/football/districts/${idDistrict}`);
      // console.log(response)
      if (response.data.success) {
         return response.data.data; // Trả về dữ liệu địa chỉ
      }
   } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
   }
   return "Không thể tải địa chỉ"; // Trả về chuỗi lỗi nếu request thất bại
};

export const fetchWard = async (districts) => {
   console.log(districts)
   try {
      const response = await axios.get(`/api/address/wards/${districts}`);
      if (response.data.success) {
         return response.data.data; // Trả về dữ liệu địa chỉ
      }
   } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
   }
   return "Không thể tải địa chỉ"; // Trả về chuỗi lỗi nếu request thất bại
};

export const fetchFootballByWard = async (idWard) => {
   // console.log("ID tỉnh gọi API:", idWard);
   try {
      const response = await axios.get(`/api/filter/football/wards/${idWard}`);
      // console.log(response)
      if (response.data.success) {
         return response.data.data; // Trả về dữ liệu địa chỉ
      }
   } catch (error) {
      console.error("Lỗi khi lấy địa chỉ:", error);
   }
   return "Không thể tải địa chỉ"; // Trả về chuỗi lỗi nếu request thất bại
};