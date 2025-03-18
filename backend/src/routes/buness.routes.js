import express from 'express';
import { createBuness, updateBusiness } from '../controllers/buness.controller.js';

const bunessRouter = express.Router();

bunessRouter
   .post('/', createBuness)
   .post('/:id', updateBusiness)
   

export default bunessRouter; 
