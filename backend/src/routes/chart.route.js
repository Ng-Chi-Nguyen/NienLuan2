import express from 'express';
import {
   getRevenueByDate,
   displayRevenueByDate,
   createRevenueMonth,
   displayRevenueMonth
} from '../controllers/chart.controller.js';

const chartRouter = express.Router();

chartRouter
   .post("/date/", getRevenueByDate)
   .get("/date/:id_Business/", displayRevenueByDate)
   .post("/month/", createRevenueMonth)
   .get("/month/:id_Business/", displayRevenueMonth)

export default chartRouter;