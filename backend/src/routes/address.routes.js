import express from 'express';
import {
   getProvinces,
   getDistricts,
   getWards,
   getProvince,
   getDistrict,
   getWard
} from "../controllers/address.controler.js";
const addressRouter = express.Router();

addressRouter
   .get("/provinces/", getProvinces)
   .get("/districts/:id", getDistricts)
   .get("/wards/:id", getWards)

   .get("/province/:id", getProvince)
   .get("/district/:id", getDistrict)
   .get("/ward/:id", getWard)

export default addressRouter; 
