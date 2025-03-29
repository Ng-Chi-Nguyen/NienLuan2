import express from "express";

const bookingRouter = express.Router();
import { createBooking, displayBoking, displayBokingInfoUser } from "../controllers/bookingUser.controller.js";
bookingRouter
   .post("/", createBooking)
   .get("/:id", displayBoking)
   .get("/userInfo/:id", displayBokingInfoUser)

export default bookingRouter;