import axios from "axios";



// Hàm lấy thông tin sân bóng theo ID sân bóng
export const getFootballFieldById = async (id_FF) => {
   if (!id_FF) {
      console.log(`Không tìm thấy sân bóng với ID: ${id_FF}`);
      return null;
   }

   try {
      let response = await axios.get(`/api/foolbalField/football/${id_FF}`);
      if (response.data.success) {
         return response.data.data; // Trả về dữ liệu sân bóng
      }
   } catch (e) {
      console.error("Lỗi khi lấy thông tin sân bóng:", e);
   }

   return null;
};

// Lấy thông tin sân bóng theo ID chủ doanh nghiệp
export const fetchFootballFieldsAPI = async (userId) => {
   if (!userId) {
      console.error("Lỗi: Thiếu ID người dùng!");
      return [];
   }
   try {
      const response = await fetch(`/api/foolbalField/${userId}`);
      const result = await response.json();
      if (result.success) {
         return result.data.map((item, index) => ({
            ...item,
            key: item.id || index.toString(),
         }));
      } else {
         console.error("Lỗi:", result.message);
      }
   } catch (error) {
      console.error("Lỗi kết nối API:", error);
   }
   return [];
};

// Xóa sân bóng theo id sân bóng
export const deleteFootballByID = async (id) => {
   if (!id) {
      alert("Không tìm thấy sân bóng trong hệ thống");
      return false;
   }

   try {
      const response = await axios.delete(`/api/foolbalField/${id}`);
      if (response.data.success) {
         return true; // Trả về true nếu xóa thành công
      } else {
         alert(`Lỗi: ${response.data.message}`);
         return false;
      }
   } catch (error) {
      console.error("Lỗi khi xóa sân bóng:", error);
      alert("Lỗi hệ thống khi xóa sân bóng!");
      return false;
   }
};