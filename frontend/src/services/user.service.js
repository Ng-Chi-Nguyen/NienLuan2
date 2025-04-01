import axios from "axios";

export const createUser = async (formData) => {
   try {
      const response = await axios.post("/api/user/", formData);
      return response.data; // Trả về dữ liệu phản hồi từ backend
   } catch (error) {
      throw error; // Ném lỗi ra ngoài để xử lý ở component gọi hàm
   }
};

export const updateUser = async (user) => {
   if (!user.id) {
      console.error("Lỗi: Không có ID người dùng!");
      return { success: false, error: "Không có ID người dùng" };
   }

   try {
      let response = await axios.post(`/api/user/${user.id}`, {
         name: user.name || "",
         phone: user.phone || "",
         email: user.email || "",
         address: user.address || "",
         gender: user.gender ?? null
      });

      return response.data;
   } catch (error) {
      console.error("Lỗi khi cập nhật user:", error);
      return { success: false, error: error.message };
   }
};
