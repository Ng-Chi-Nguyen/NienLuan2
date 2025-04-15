import express, { Router } from "express";

import {
   getFootballProvinces,
   getFootballDistricts,
   getFootballWards
} from "../controllers/filter.controller.js";


const filterRouter = express.Router();

filterRouter
   .get("/provinces/:id", getFootballProvinces)
   .get("/districts/:id", getFootballDistricts)
   .get("/wards/:id", getFootballWards)

export default filterRouter;