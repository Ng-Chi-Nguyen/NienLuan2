import axios from "axios";

export const DisplayByBusinessDate = async (userId, date) => {
   try {
      let url = `/api/chart/date/${userId}/`;
      if (date) {
         url = `/api/chart/date/${userId}/?dateStart=${date}`; // Gửi ngày đã chọn vào query string
      }

      const response = await axios.get(url);
      const data = response.data;
      // Trả về dữ liệu cho component gọi
      return data;
   } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
   }
};

export const DisplayByBusinessMonth = async (userId, date) => {
   try {
      let url = `/api/chart/month/${userId}/`;
      if (date) {
         url = `/api/chart/month/${userId}/?dateStart=${date}`; // Gửi ngày đã chọn vào query string
      }

      const response = await axios.get(url);
      const data = response.data;

      // Trả về dữ liệu cho component gọi
      return data;
   } catch (error) {
      console.error("Error fetching data:", error);
      throw error;
   }
};