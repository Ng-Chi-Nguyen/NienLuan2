import { notification } from "antd";

export const Message = (message, description, type = "info") => {
   notification[type]({
      message,
      description,
      duration: 3, // Thời gian hiển thị (giây)
      showProgress: true, // Hiển thị thanh tiến trình
   });
}