import {
   getRevenueByDateService,
   displayRevenueByDateService
} from "../services/chart.service.js";

export const getRevenueByDate = async (req, res) => {
   console.log(req.body)
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

      console.log("date:", dateStart, "id_Business:", id_Business);

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

}
export const createRevenueYear = async (req, res) => {

}