import { notification } from "antd";

export const Message = (message, description, type = "info") => {
   notification[type]({
      message,
      description,
      duration: 5, // Thời gian hiển thị (giây)
      showProgress: true, // Hiển thị thanh tiến trình
   });
}

export const formatNumber = (n) => {
   return new Intl.NumberFormat("en-US", {
      style: "decimal",
      minimumFractionDigits: 0,
   }).format(n);
};