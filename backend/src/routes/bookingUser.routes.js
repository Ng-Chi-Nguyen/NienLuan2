import express from "express";

const bookingRouter = express.Router();
import { createBooking, displayBoking, displayBokingInfoUser, displayAllFootballToday, deleteBooking } from "../controllers/bookingUser.controller.js";
bookingRouter
   .post("/", createBooking)
   .get("/:id", displayBoking)
   .get("/userInfo/:id", displayBokingInfoUser) // Lay ra tat ca lich ma id da dat
   .get("/AllFootballToday/:id_Business", displayAllFootballToday) // Lay ra all lich dat san trong hom nay theo id doaanh nghiep
   .delete("/:id", deleteBooking)

export default bookingRouter;