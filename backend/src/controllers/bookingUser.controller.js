import {
   createBookingService,
   displayBokingService,
   displayBokingInfoUserService,
   getBookingsForTodayByBusiness,
   deleteBookingService
} from "../services/bookingUser.service.js";

export let createBooking = async (req, res) => {
   // console.log(req.body)
   try {
      let result = await createBookingService(req.body);

      if (!result.success) {
         return res.json({
            success: false,
            message: result.message
         });
      }

      return res.json({
         success: true,
         message: result.message,
         data: result.data
      });

   } catch (e) {
      return res.json({
         success: false,
         message: "Lỗi hệ thống: " + e.message
      });
   }
};


export let displayBoking = async (req, res) => {
   let { id } = req.params;
   if (!id) {
      return res.json({
         success: false,
         message: `Không tìm thấy ${id}`
      })
   }
   try {
      let result = await displayBokingService(id)
      if (!result.success) {
         return res.json({
            success: result.success,
            message: result.message,
         })
      }
      return res.json({
         success: result.success,
         data: result.data
      })
   } catch (e) {
      return res.json({
         success: false,
         message: e
      })
   }
}

export let displayBokingInfoUser = async (req, res) => {
   let { id } = req.params;
   const type = req.query.type;
   if (!id) {
      return res.json({
         success: false,
         message: `Không tìm thấy ${id}`
      })
   }
   if (!type) {
      return res.json({
         success: false,
         message: `Không tìm thấy ${type}`
      })
   }
   try {
      let result = await displayBokingInfoUserService(id, type)
      if (!result.success) {
         return res.json({
            success: result.success,
            message: result.message
         })
      }
      return res.json({
         success: result.success,
         data: result.data
      })
   } catch (e) {
      console.log(e)
      return res.json({
         success: false,
         message: e
      })
   }
}

export const displayAllFootballToday = async (req, res) => {
   const { id_Business } = req.params;

   if (!id_Business) {
      return res.json({
         success: false,
         message: "Thiếu thông tin doanh nghiệp (id_Business)"
      });
   }

   try {
      // Gọi service để lấy tất cả lịch đặt sân trong ngày hôm nay theo id_Business
      const result = await getBookingsForTodayByBusiness(id_Business);

      if (result.success) {
         return res.status(200).json(result);  // Trả về dữ liệu nếu thành công
      } else {
         return res.status(500).json(result);  // Trả về lỗi nếu không thành công
      }
   } catch (error) {
      return res.status(500).json({
         success: false,
         message: "Lỗi hệ thống: " + error.message
      });
   }
};

export const deleteBooking = async (req, res) => {
   const { id } = req.params;
   if (!id) {
      return res.json({
         success: false,
         message: "Không tìm thấy lịch đặt sân của bạn trong hệ thống"
      })
   }
   let result = await deleteBookingService(id)
   if (!result.success) {
      return res.json({
         success: result.success,
         message: result.message
      })
   }
   return res.json({
      success: result.success,
      message: result.message
   })
}