import { sql } from '../config/connect.js';
export const getRevenueByDateService = async (data) => {
   try {
      const { dateStart, id_Business } = data; // Lấy ngày và id_Business từ dữ liệu

      // Truy vấn dữ liệu từ bảng booking để tính doanh thu theo ngày cho từng sân
      const { data: bookingData, error: bookingError } = await sql
         .from('Booking')  // Đảm bảo tên bảng đúng (chắc chắn không phải 'Booking')
         .select('price, id_FF') // Lấy giá và idFF thay vì id_san
         .eq('date', dateStart)  // Lọc theo ngày bắt đầu
         .eq('id_Business', id_Business);  // Lọc theo id_Business

      // Nếu có lỗi khi truy vấn booking, ném lỗi
      if (bookingError) {
         throw new Error(bookingError.message);
      }

      // Tính tổng doanh thu theo ngày cho từng sân
      let revenueByCourt = {}; // Object lưu doanh thu theo từng sân
      bookingData.forEach(item => {
         // Tính doanh thu cho mỗi sân dựa trên idFF
         if (!revenueByCourt[item.id_FF]) {
            revenueByCourt[item.id_FF] = 0;
         }
         revenueByCourt[item.id_FF] += item.price;
      });

      // Chèn doanh thu vào bảng Revenue_Day cho từng sân
      for (const idFF in revenueByCourt) {
         const totalRevenue = revenueByCourt[idFF];

         // Chèn vào bảng Revenue_Day
         const { error: insertError } = await sql
            .from('Revenue_Date')  // Đảm bảo tên bảng đúng (chắc chắn không phải 'Revenue_Date')
            .insert([{
               dateStart: dateStart,
               Total: totalRevenue,  // Doanh thu tính được cho sân này
               idFF: idFF,            // ID của sân (idFF)
               id_Business: id_Business
            }]);

         // Nếu có lỗi khi insert, ném lỗi
         if (insertError) {
            throw new Error(insertError.message);
         }
      }

      // Trả về kết quả
      return {
         message: 'Doanh thu theo ngày đã được tính toán và lưu thành công!',
         revenueByCourt
      };
   } catch (e) {
      console.log(e);
      throw new Error('Có lỗi khi lấy dữ liệu doanh thu hoặc chèn dữ liệu vào Revenue_Day');
   }
};
export const displayRevenueByDateService = async (dateStart, id_Business) => {
   console.log(dateStart, " ", id_Business)
   try {
      // Truy vấn dữ liệu từ bảng Revenue_Date
      const { data, error } = await sql
         .from('Revenue_Date')
         .select('*')  // Lấy thông tin doanh thu, id sân, và ngày
         .eq('dateStart', dateStart)  // Lọc theo ngày
         .eq('id_Business', id_Business);  // Lọc theo id doanh nghiệp

      // Nếu có lỗi trong truy vấn, ném lỗi
      if (error) {
         throw new Error(error.message);
      }

      // Trả về dữ liệu từ bảng Revenue_Date
      return data;
   } catch (e) {
      throw new Error('Có lỗi khi lấy dữ liệu từ bảng Revenue_Date');
   }
};