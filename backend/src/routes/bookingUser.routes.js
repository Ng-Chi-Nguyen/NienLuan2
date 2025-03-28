import express from "express";

const bookingRouter = express.Router();
import { createBooking } from "../controllers/bookingUser.controller.js";
bookingRouter
   .post("/", createBooking)

export default bookingRouter;