import axios from "axios";

export const createBusiness = async (formData) => {
   try {
      const response = await axios.post("/api/business/", formData);
      return response.data; // Trả về dữ liệu phản hồi từ backend
   } catch (error) {
      throw error; // Ném lỗi ra ngoài để xử lý ở component gọi hàm
   }
};

// Hàm lấy thông tin doanh nghiệp theo ID
export const getBusinessById = async (id_Business) => {
   if (!id_Business) {
      console.log(`Không tìm thấy ${id_Business}`);
      return null;
   }
   try {
      let response = await axios.get(`/api/business/${id_Business}`);
      if (response.data.success) {
         return response.data.data; // Trả về dữ liệu doanh nghiệp
      } else {
         throw new Error("Không thành công khi lấy thông tin doanh nghiệp");
      }
   } catch (e) {
      console.error("Lỗi khi lấy thông tin doanh nghiệp:", e);
      throw e; // Ném lỗi để có thể xử lý ở nơi gọi hàm
   }
   return null;
};

export const updateBusiness = async (user) => {
   if (!user.id) {
      console.error("Lỗi: Không có ID người dùng!");
      return { success: false, error: "Không có ID người dùng" };
   }

   try {
      let response = await axios.post(`/api/business/${user.id}`, {
         name: user.name || "",
         phone: user.phone || "",
         email: user.email || "",
         owner_name: user.owner_name || "",
         address: user.address || "",
      });

      return response.data;
   } catch (error) {
      console.error("Lỗi khi cập nhật business:", error);
      return { success: false, error: error.message };
   }
};