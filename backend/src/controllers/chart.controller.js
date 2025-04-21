import {
   getRevenueByDateService,
   displayRevenueByDateService,
   createRevenueMonthService,
   displayRevenueByMonthService
} from "../services/chart.service.js";

export const getRevenueByDate = async (req, res) => {
   // console.log(req.body)
   try {
      const { dateStart, id_Business } = req.body; // Lấy dateStart và idFF từ request body

      // Gọi service để tính toán doanh thu
      const result = await getRevenueByDateService({ dateStart, id_Business });

      // Trả về kết quả
      return res.json({
         message: result.message, // Thông điệp trả về từ service
         revenueByCourt: result.revenueByCourt, // Doanh thu theo từng sân (idFF)
      });
   } catch (e) {
      console.log(e);
      return res.status(500).json({ error: e.message });
   }
};

export const displayRevenueByDate = async (req, res) => {
   try {
      const { id_Business } = req.params; // Lấy id_Business từ params
      let { dateStart } = req.query; // Lấy dateStart từ query string (nếu có)

      // Nếu không có dateStart, gán giá trị mặc định là ngày hôm nay
      if (!dateStart) {
         dateStart = new Date().toISOString().split('T')[0]; // Định dạng ngày theo kiểu yyyy-MM-dd
      }

      // console.log("date:", dateStart, "id_Business:", id_Business);

      // Gọi service để lấy doanh thu
      const revenueByCourt = await displayRevenueByDateService(dateStart, id_Business);

      // Kiểm tra xem có dữ liệu hay không
      if (Object.keys(revenueByCourt).length === 0) {
         return res.json({ message: 'Không có doanh thu cho ngày này' });
      }

      // Trả về dữ liệu doanh thu theo sân
      return res.json({
         message: 'Doanh thu theo ngày đã được tính toán',
         data: revenueByCourt
      });
   } catch (e) {
      console.error(e);
      return res.json({ message: 'Có lỗi khi lấy dữ liệu doanh thu' });
   }
}

export const createRevenueMonth = async (req, res) => {
   try {
      let { dateStart, id_Business } = req.body; // Lấy dateStart từ query string (nếu có)

      // Nếu không có dateStart, gán giá trị mặc định là ngày 1 tháng trước
      if (!dateStart) {
         const today = new Date();
         // Lùi một tháng
         today.setMonth(today.getMonth() - 1);
         today.setDate(1); // Đặt ngày là ngày đầu tháng

         // Định dạng ngày theo kiểu yyyy-MM-dd
         dateStart = today.toISOString().split('T')[0];
      }

      // console.log("dateStart:", dateStart, "id_Business:", id_Business);

      // Gọi service để lấy doanh thu
      const result = await createRevenueMonthService(dateStart, id_Business);

      // Kiểm tra xem có dữ liệu hay không
      if (Object.keys(result).length === 0) {
         return res.json({ message: 'Không có doanh thu cho tháng trước' });
      }

      // Trả về dữ liệu doanh thu theo sân
      return res.json({
         message: 'Doanh thu của tháng trước đã được tính toán',
         data: result
      });
   } catch (e) {
      console.error(e);
      return res.json({ message: 'Có lỗi khi lấy dữ liệu doanh thu' });
   }
}
export const displayRevenueMonth = async (req, res) => {
   try {
      const { id_Business } = req.params;
      let { dateStart } = req.query;

      // Hàm format ngày local (không bị ảnh hưởng timezone)
      const formatLocalDate = (date) => {
         const year = date.getFullYear();
         const month = String(date.getMonth() + 1).padStart(2, '0');
         const day = String(date.getDate()).padStart(2, '0');
         return `${year}-${month}-${day}`;
      };

      // Nếu dateStart có định dạng "YYYY-MM", thêm ngày đầu tháng là "01"
      if (dateStart && !dateStart.includes('-01')) {
         dateStart = `${dateStart}-01`; // Chuyển thành "YYYY-MM-01"
      }

      // Nếu không có dateStart, lấy ngày đầu tháng trước
      if (!dateStart) {
         const today = new Date();
         const firstDayLastMonth = new Date(today.getFullYear(), today.getMonth() - 1, 1);
         dateStart = formatLocalDate(firstDayLastMonth);
      }

      // Log dữ liệu ngày gọi API
      // console.log(`Lấy doanh thu ${id_Business} từ ngày: ${dateStart}`);

      // Xử lý và gọi API chỉ khi `dateStart` là ngày bạn mong muốn
      const result = await displayRevenueByMonthService(id_Business, dateStart);

      if (!result.success) {
         return res.status(400).json({ message: result.message });
      }

      return res.json({
         message: 'Lấy dữ liệu doanh thu thành công!',
         data: result.data
      });

   } catch (error) {
      console.error(`Lỗi Controller: ${error.message}`);
      return res.status(500).json({ message: 'Có lỗi khi lấy dữ liệu doanh thu' });
   }
};