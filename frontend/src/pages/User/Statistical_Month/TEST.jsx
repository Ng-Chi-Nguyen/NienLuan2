import { useState, useEffect } from "react";
import { Bar } from "react-chartjs-2";
import dayjs from 'dayjs';
import { DisplayByBusinessMonth } from "../../../services/chart.service";
import { DatePicker } from "antd"; // Nếu bạn sử dụng DatePicker của Ant Design
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
} from "chart.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Tạo danh sách nhóm (tuần 1 -> tuần 4 + 3 ngày cuối)
const labels = ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4", "Các ngày cuối"];

const generateWeeklyRevenue = (data) => {
   if (!Array.isArray(data)) {
      console.error("Data is not an array:", data);
      return [0, 0, 0, 0, 0]; // Tránh lỗi
   }

   const weeklyRevenue = [0, 0, 0, 0, 0];
   data.forEach((item) => {
      const weekIndex = item.weeks - 1;
      if (weekIndex >= 0 && weekIndex < 5) {
         weeklyRevenue[weekIndex] += item.Total;
      }
   });

   return weeklyRevenue
}

export default function DisplayRevenueChart({ user }) {
   const [revenueData, setRevenueData] = useState([]);
   const [date, setDate] = useState(dayjs().subtract(1, 'month').format("YYYY-MM")); // Mặc định là tháng trước


   useEffect(() => {
      const fetchData = async () => {
         try {
            const data = await DisplayByBusinessMonth(user.id, date);
            console.log("API response:", data);

            // Kiểm tra nếu data không phải là mảng, đặt giá trị mặc định
            const formattedData = Array.isArray(data) ? data : [];
            setRevenueData(formattedData);
         } catch (error) {
            console.error("Error fetching data:", error);
            setRevenueData([]); // Nếu lỗi, đặt dữ liệu rỗng để tránh lỗi forEach
         }
      };

      fetchData();
   }, [user.id, date]);

   // Tính tổng doanh thu theo tuần
   const revenueByWeek = generateWeeklyRevenue(revenueData);

   const data = {
      labels: labels,
      datasets: [
         {
            label: "Sân 1",
            data: revenueByWeek, // Dữ liệu doanh thu của sân
            backgroundColor: "rgba(255, 99, 132, 0.6)"
         }
         // Bạn có thể thêm dữ liệu cho các sân khác tại đây tương tự như trên
      ]
   };

   const options = {
      responsive: true,
      plugins: {
         tooltip: {
            callbacks: {
               label: (tooltipItem) => {
                  return `Doanh thu: ${tooltipItem.raw.toLocaleString()} VNĐ`;
               }
            }
         }
      },
      scales: {
         x: {
            title: {
               display: true,
               text: "Thời gian (Tuần)"
            }
         },
         y: {
            beginAtZero: true,
            title: {
               display: true,
               text: "Doanh thu (VNĐ)"
            }
         }
      }
   };

   // Hàm xử lý khi chọn tháng
   const onChange = (selectedDate) => {
      if (selectedDate) {
         const newDate = dayjs(selectedDate).format("YYYY-MM");
         setDate(newDate); // Cập nhật date để useEffect chạy lại
      }
   };

   return (
      <div className="Revenue_Month">
         <p style={{ textAlign: "center" }}>Thống kê doanh thu trong tháng</p>
         <DatePicker
            onChange={onChange}
            picker="month"
            defaultValue={dayjs().subtract(1, 'month')}
            format="YYYY-MM"
         />
         <Bar data={data} options={options} />
      </div>
   );
};

