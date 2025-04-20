import { Bar } from "react-chartjs-2";
import { useState, useEffect } from "react";
import dayjs from 'dayjs';
import { DatePicker } from "antd";
import {
   Chart as ChartJS,
   CategoryScale,
   LinearScale,
   BarElement,
   Title,
   Tooltip,
   Legend
} from "chart.js";
import { DisplayByBusinessMonth } from "../../../services/chart.service";
import { getFootballFieldById } from "../../../services/footballField.service.js";

// Đăng ký các thành phần của Chart.js
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

// Nhãn trục X (tuần)
const labels = ["Tuần 1", "Tuần 2", "Tuần 3", "Tuần 4", "Các ngày còn lại"];

// Hàm xử lý dữ liệu API thành dạng biểu đồ
const processRevenueData = (data) => {
   const weeklyRevenue = {}; // Lưu doanh thu theo tuần + sân

   data.forEach(({ weeks, Total, idFF }) => {
      if (idFF > 0) {
         if (!weeklyRevenue[idFF]) {
            weeklyRevenue[idFF] = [0, 0, 0, 0, 0]; // Khởi tạo mảng 5 tuần
         }
         if (weeks >= 1 && weeks <= 4) {
            weeklyRevenue[idFF][weeks - 1] += Total; // Dồn doanh thu vào tuần
         } else {
            weeklyRevenue[idFF][4] += Total; // cac ngày cuối
         }
      } else {
         console.warn(`idFF không hợp lệ trong dữ liệu: ${idFF}`);
      }
   });

   return weeklyRevenue;
};

export default function StatisticalMonth({ user }) {
   const [revenueData, setRevenueData] = useState([]);
   const [date, setDate] = useState(dayjs().subtract(1, 'month').format("YYYY-MM"));
   const [fieldNames, setFieldNames] = useState({});

   const fetchFootballFieldName = async (id_FF) => {
      const fieldData = await getFootballFieldById(id_FF);
      if (fieldData && fieldData.length > 0) {
         setFieldNames(prevState => ({
            ...prevState,
            [id_FF]: fieldData[0].name // Save the field name for the idFF
         }));
      } else {
         setFieldNames(prevState => ({
            ...prevState,
            [id_FF]: `Không tìm thấy sân bóng với ID: ${id_FF}`
         }));
      }
   };

   useEffect(() => {
      const fetchData = async () => {
         try {
            const response = await DisplayByBusinessMonth(user.id, date);
            const formattedData = Array.isArray(response.data) ? response.data : [];
            setRevenueData(formattedData);
         } catch (error) {
            console.error("Error fetching data:", error);
            setRevenueData([]);
         }
      };

      fetchData();
   }, [user.id, date]);

   const weeklyData = processRevenueData(revenueData);

   // Màu sắc cho các sân
   const colors = [
      "rgba(255, 99, 132, 0.6)",
      "rgba(54, 162, 235, 0.6)",
      "rgba(255, 206, 86, 0.6)",
      "rgba(75, 192, 192, 0.6)",
      "rgba(153, 102, 255, 0.6)",
      "rgba(255, 179, 204, 0.6)",
      "rgba(255, 19, 164, 0.6)",
      "rgba(25, 152, 64, 0.6)",
      "rgba(25, 259, 64, 0.6)",
   ];

   // Fetch field names for each idFF in weeklyData (only once when data changes)
   useEffect(() => {
      const uniqueFieldIds = Object.keys(weeklyData);
      uniqueFieldIds.forEach(idFF => {
         if (!fieldNames[idFF]) {
            fetchFootballFieldName(idFF);
         }
      });
   }, [weeklyData, fieldNames]);

   // Tạo dữ liệu cho biểu đồ
   const data = {
      labels: labels, // Nhãn trục X (Tuần)
      // object chứa doanh thu từng sân theo tuần
      // weeklyData = {
      //    1: [100, 200, 150, 180, 90],
      //    2: [80, 120, 160, 110, 100]
      // };
      datasets: Object.keys(weeklyData).map((idFF, index) => {
         // Số lượng sân vượt quá số lượng màu sắc trong mảng colors, nó sẽ quay lại sử dụng các màu đầu tiên
         const fieldColor = colors[index % colors.length];
         const fieldName = fieldNames[idFF] || `Sân ${idFF}`; // Use the field name from state or fallback

         return {
            label: fieldName, // Nhan moi san
            data: weeklyData[idFF], // Doanh thu của sân theo tuần
            backgroundColor: fieldColor, // Màu sắc sân
         };
      })
   };

   const options = {
      responsive: true,
      plugins: {
         tooltip: {
            callbacks: {
               label: (tooltipItem) => {
                  const datasetIndex = tooltipItem.datasetIndex;
                  const fieldName = data.datasets[datasetIndex].label;
                  const revenue = tooltipItem.raw; // Gia tri khi hover vao
                  return `${fieldName}: ${revenue.toLocaleString()} VNĐ`;
               }
            }
         }
      },
      scales: { // Cấu hình trục cho biểu đồ.
         x: {
            title: {
               display: true,
               text: "Thời gian (Tuần)"
            }
         },
         y: {
            beginAtZero: true, //  Đảm bảo trục Y bắt đầu từ 0, tránh có các giá trị âm
            title: {
               display: true,
               text: "Doanh thu (VNĐ)"
            }
         }
      }
   };

   const onChange = (selectedDate) => {
      if (selectedDate) {
         const newDate = dayjs(selectedDate).format("YYYY-MM");
         setDate(newDate);
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
}
