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


export const getUserById = async (id_User) => {
   if (!id_User) {
      console.log(`Không tìm thấy ${id_User}`);
      return null;
   }
   try {
      let response = await axios.get(`/api/user/${id_User}`);
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