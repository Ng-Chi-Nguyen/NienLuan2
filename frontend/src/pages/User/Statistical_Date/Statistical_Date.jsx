import { useState, useEffect, useCallback } from "react";
import './Statistical_Date.scss';
import { Pie } from "react-chartjs-2";
import {
   Chart as ChartJS,
   ArcElement, // Bieu do tron
   Tooltip, // phép hiển thị thông tin chi tiết khi người dùng di chuột vào
   Legend
} from "chart.js";
import dayjs from 'dayjs';
import { DatePicker } from 'antd';
import { DisplayByBusinessDate } from "../../../services/chart.service.js";
import { getFootballFieldById } from "../../../services/footballField.service.js";
import { formatNumber } from "../../../utils/utils.js";

// Đăng ký các thành phần cần thiết của Chart.js
ChartJS.register(ArcElement, Tooltip, Legend);


export default function StatisticalDate({ user }) {
   const [chartData, setChartData] = useState(null); // Lưu dữ liệu cho biểu đồ
   const [selectedDate, setSelectedDate] = useState(dayjs().subtract(1, 'day')); // Lưu ngày đã chọn
   const [sumPrice, setSumPrice] = useState(0)
   // console.log(user)

   const fetchFootballFields = async (data) => {
      try {
         const idFFList = data.map(item => item.idFF); // Lấy danh sách idFF từ dữ liệu
         const fieldNames = []; // Mảng để chứa tên sân

         for (const idFF of idFFList) {
            const field = await getFootballFieldById(idFF); // Gọi API để lấy thông tin sân
            if (field && field[0]) {
               fieldNames.push(field[0].name); // Thêm tên sân vào mảng fieldNames
            }
         }

         // console.log("Football Field Names:", fieldNames); // In ra danh sách tên sân
         return fieldNames; // Trả về danh sách tên sân
      } catch (error) {
         console.error("Error fetching field names:", error);
         return []; // Trả về mảng trống trong trường hợp có lỗi
      }
   }

   const getRandomColor = () => {
      const r = Math.floor(Math.random() * 256);
      const g = Math.floor(Math.random() * 256);
      const b = Math.floor(Math.random() * 256);
      return `rgb(${r}, ${g}, ${b})`; // Trả về màu ngẫu nhiên
   };

   const getBorderColor = (rgb) => {
      const [r, g, b] = rgb.match(/\d+/g).map(Number);
      return `rgb(${Math.max(0, r - 50)}, ${Math.max(0, g - 50)}, ${Math.max(0, b - 50)})`;
   };

   // Hàm fetch dữ liệu
   const fetchData = useCallback(async (date) => {
      try {
         const data = await DisplayByBusinessDate(user.id, date);
         if (data && Array.isArray(data.data)) { // có phải là mảng Không
            // chartValues chứa doanh thu từng sân
            const chartValues = data.data.map(item => item.Total || 0); // Nếu k có doanh thu thì gán giá trị là 0
            const fieldNames = await fetchFootballFields(data.data);
            const colors = fieldNames.map(() => getRandomColor());
            const borderColors = colors.map(color => getBorderColor(color));
            const totalRevenue = chartValues.reduce((acc, value) => acc + value, 0);
            await setSumPrice(totalRevenue); // Cập nhật tổng doanh thu

            // Cập nhật dữ liệu cho biểu đồ
            setChartData({
               labels: fieldNames, // Dữ liệu nhãn
               datasets: [
                  {
                     label: "Doanh thu",
                     data: chartValues, // Dữ liệu các giá trị
                     backgroundColor: colors,
                     borderColor: borderColors,
                     borderWidth: 2,
                     hoverOffset: 4 //  hover vào đẩy ra khỏi vị trí ban đầu 4px
                  }
               ]
            });
         } else {
            setChartData(null); // Nếu không có dữ liệu, xóa biểu đồ
         }
      } catch (error) {
         console.error("Error fetching data:", error);
      }
   }, [user.id]);
   // Lắng nghe sự kiện thay đổi ngày từ DatePicker
   useEffect(() => {
      const yesterday = dayjs().subtract(1, 'day'); // Lấy ngày hiện tại với dayjs
      setSelectedDate(yesterday); // Set ngày hiện tại vào selectedDate
      fetchData(yesterday.format('YYYY-MM-DD'));  // Gọi hàm fetchData để lấy dữ liệu cho ngày hôm nay
   }, [fetchData]); // useEffect chỉ chạy khi component mount lần đầu tiên

   // Hàm xử lý thay đổi ngày
   const handleDateChange = (date) => {
      setSelectedDate(date); // vẫn giữ dạng dayjs object
      const formattedDate = date ? date.format('YYYY-MM-DD') : null;
      fetchData(formattedDate); // chỉ format khi gọi API
   };
   return (
      <div className="Revenue_Date">
         <p>Doanh thu theo ngày</p>
         <DatePicker onChange={handleDateChange} value={selectedDate} />
         <div className="char">
            {chartData ? (
               <Pie data={chartData} />
            ) : (
               <div>Không có doanh thu cho ngày này</div>
            )}
         </div>
         <p className="text-center">Tổng: <span>{formatNumber(sumPrice)}</span>đ</p>
      </div>
   );
}
