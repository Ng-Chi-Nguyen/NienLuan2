import express from 'express';
import {
   getRevenueByDate,
   displayRevenueByDate,
   createRevenueMonth,
   createRevenueYear
} from '../controllers/chart.controller.js';

const chartRouter = express.Router();

chartRouter
   .post("/date/", getRevenueByDate)
   .get("/date/:id_Business/", displayRevenueByDate)
   .post("/month/", createRevenueMonth)
   .post("/year/", createRevenueYear);

export default chartRouter;