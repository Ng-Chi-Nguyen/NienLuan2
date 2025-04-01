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