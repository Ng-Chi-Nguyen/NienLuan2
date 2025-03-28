import { createBookingService } from "../services/bookingUser.service.js";

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
