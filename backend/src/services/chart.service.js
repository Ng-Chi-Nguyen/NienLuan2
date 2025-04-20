import { sql } from '../config/connect.js';
import cron from 'node-cron';
import dayjs from 'dayjs';
// Chạy thống kê doanh thu lúc 23:00 mỗi ngày
cron.schedule('0 23 * * *', async () => {
   // console.log('Chạy thống kê doanh thu lúc 23:00...');

   const today = new Date().toISOString().split('T')[0]; // Lấy ngày hiện tại

   try {
      // Lấy danh sách tất cả id_Business từ bảng Business
      const { data: businesses, error } = await sql
         .from('Business')
         .select('id');

      if (error) throw new Error(error.message);
      if (!businesses.length) {
         console.log('Không có doanh nghiệp nào để thống kê!');
         return;
      }

      // Chạy thống kê doanh thu cho từng doanh nghiệp
      for (const business of businesses) {
         const id_Business = business.id;
         try {
            const result = await getRevenueByDateService({ dateStart: today, id_Business });
            // console.log(`Doanh thu của doanh nghiệp ${id_Business} đã được thống kê:`, result);
         } catch (error) {
            console.error(`Lỗi khi thống kê doanh thu cho doanh nghiệp ${id_Business}:`, error.message);
         }
      }
   } catch (error) {
      console.error('Lỗi khi lấy danh sách doanh nghiệp:', error.message);
   }
});


export const getRevenueByDateService = async (data) => {
   try {
      const { dateStart, id_Business } = data; // Lấy ngày và id_Business từ dữ liệu

      // Truy vấn dữ liệu từ bảng booking để tính doanh thu theo ngày cho từng sân
      const { data: bookingData, error: bookingError } = await sql
         .from('Booking')
         .select('price, id_FF')
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

export const createRevenueMonthService = async (dateStart, id_Business) => {
   try {
      // Hàm điều chỉnh ngày về 00:00:00 theo giờ địa phương
      const adjustDateToLocalMidnight = (date) => {
         const adjustedDate = new Date(date);
         adjustedDate.setHours(0, 0, 0, 0); // Đặt giờ thành 00:00:00 (giữa đêm)
         return adjustedDate;
      };

      const [year, month, day] = dateStart.split('-').map(Number);

      const localDateStart = new Date(year, month - 1, day);

      const firstDayOfMonth = new Date(
         localDateStart.getFullYear(),
         localDateStart.getMonth(),
         1
      );
      const lastDayOfMonth = new Date(
         localDateStart.getFullYear(),
         localDateStart.getMonth() + 1,
         0
      );

      // Hai dòng này dùng để điều chỉnh firstDayOfMonth và lastDayOfMonth về đúng nửa đêm (00:00:00) theo giờ địa phương
      const adjustedStartDate = adjustDateToLocalMidnight(firstDayOfMonth);
      const adjustedEndDate = adjustDateToLocalMidnight(lastDayOfMonth);

      // console.log(`Ngày bắt đầu tháng (local): ${adjustedStartDate.toLocaleDateString()}`);
      // console.log(`Ngày kết thúc tháng (local): ${adjustedEndDate.toLocaleDateString()}`);

      // Calculate weeks
      const weeks = [];
      let currentStartDate = new Date(adjustedStartDate); // Create new copy

      while (currentStartDate <= adjustedEndDate) {
         const currentEndDate = new Date(currentStartDate);
         currentEndDate.setDate(currentEndDate.getDate() + 6);

         if (currentEndDate > adjustedEndDate) {
            currentEndDate.setTime(adjustedEndDate.getTime());
         }

         weeks.push({
            startDate: new Date(currentStartDate),
            endDate: new Date(currentEndDate)
         });

         currentStartDate.setDate(currentStartDate.getDate() + 7);
      }

      let revenuePerCourt = {};
      for (const week of weeks) {
         const { startDate, endDate } = week;

         const formatDate = (date) => {
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
         };

         const { data, error } = await sql
            .from('Booking')
            .select('price, id_FF')
            .eq('id_Business', id_Business)
            .gte('date', formatDate(startDate))
            .lte('date', formatDate(endDate));

         if (error) throw error;

         data.forEach(item => {
            if (!revenuePerCourt[item.id_FF]) {
               revenuePerCourt[item.id_FF] = [];
            }

            const weekLabel = `${startDate.getDate()}-${endDate.getDate()}`;
            const existingWeek = revenuePerCourt[item.id_FF].find(rev => rev.week === weekLabel);

            if (existingWeek) {
               existingWeek.revenue += item.price;
            } else {
               revenuePerCourt[item.id_FF].push({
                  week: weekLabel,
                  revenue: item.price
               });
            }
         });
      }

      const remainingDaysRevenue = {};
      const lastWeekEnd = weeks.length > 0 ? weeks[weeks.length - 1].endDate : adjustedStartDate;
      const remainingDaysStart = new Date(lastWeekEnd);
      remainingDaysStart.setDate(remainingDaysStart.getDate() + 1);

      if (remainingDaysStart <= adjustedEndDate) {
         const formatDate = (date) => {
            return `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getDate().toString().padStart(2, '0')}`;
         };

         const { data } = await sql
            .from('Booking')
            .select('price, id_FF')
            .eq('id_Business', id_Business)
            .gte('date', formatDate(remainingDaysStart))
            .lte('date', formatDate(adjustedEndDate));

         data.forEach(item => {
            if (!remainingDaysRevenue[item.id_FF]) {
               remainingDaysRevenue[item.id_FF] = 0;
            }
            remainingDaysRevenue[item.id_FF] += item.price;
         });
      }

      const result = [];
      Object.keys(revenuePerCourt).forEach(id_FF => {
         revenuePerCourt[id_FF].forEach((weekRevenue, index) => {
            result.push({
               id_FF,
               id_Business,
               dateStart: adjustedStartDate.toLocaleDateString(), // Sử dụng ngày đã điều chỉnh
               dateEnd: adjustedEndDate.toLocaleDateString(),     // Sử dụng ngày đã điều chỉnh
               weeks: index + 1,
               Total: weekRevenue.revenue
            });
         });

         if (remainingDaysRevenue[id_FF]) {
            result.push({
               id_FF,
               id_Business,
               dateStart: adjustedStartDate.toLocaleDateString(), // Sử dụng ngày đã điều chỉnh
               dateEnd: adjustedEndDate.toLocaleDateString(),     // Sử dụng ngày đã điều chỉnh
               weeks: weeks.length + 1,
               Total: remainingDaysRevenue[id_FF]
            });
         }
      });

      // Lưu vào cơ sở dữ liệu
      for (const revenue of result) {
         await sql
            .from('Revenue_Month')
            .insert({
               dateStart: revenue.dateStart, // Lấy chỉ phần ngày
               dateEnd: revenue.dateEnd,     // Lấy chỉ phần ngày
               idFF: revenue.id_FF,
               Total: revenue.Total,
               id_Business: id_Business,
               weeks: revenue.weeks
            });
      }

      console.log(result)

      return {
         message: 'Doanh thu của từng sân trong tháng đã được tính toán và lưu vào cơ sở dữ liệu!',
         result
      };
   } catch (e) {
      console.error(e);
      throw new Error('Có lỗi khi tính doanh thu');
   }
};

export const displayRevenueByMonthService = async (id_Business, dateStart) => {
   try {
      // console.log(`Lấy doanh thu ${id_Business} từ ngày: ${dateStart}`);

      // Hàm format ngày local (không dùng ISO để tránh lệch múi giờ)
      const formatLocalDate = (date) => {
         const pad = num => num.toString().padStart(2, '0');
         return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}`;
      };

      // Chuyển đổi dateStart thành Date object (xử lý đúng múi giờ)
      const startDate = new Date(dateStart);
      if (isNaN(startDate)) throw new Error('Định dạng dateStart không hợp lệ');

      // Tính ngày cuối tháng (local time)
      const lastDayOfMonth = new Date(
         startDate.getFullYear(),
         startDate.getMonth() + 1,
         0
      );

      // console.log(`Phạm vi dữ liệu: ${formatLocalDate(startDate)} đến ${formatLocalDate(lastDayOfMonth)}`);

      // Truy vấn database với ngày local
      const { data, error } = await sql
         .from('Revenue_Month')
         .select('*')
         .eq('id_Business', id_Business)
         .gte('dateStart', formatLocalDate(startDate))  // Dùng hàm format local
         .lte('dateEnd', formatLocalDate(lastDayOfMonth));

      if (error) throw error;

      return { success: true, data };

   } catch (error) {
      console.error(`Lỗi Service: ${error.message}`);
      return { success: false, message: error.message };
   }
};