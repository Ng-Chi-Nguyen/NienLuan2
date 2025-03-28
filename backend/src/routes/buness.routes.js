import express from 'express';
import { createBuness, updateBusiness, displayBusiness } from '../controllers/buness.controller.js';

const bunessRouter = express.Router();

bunessRouter
   .post('/', createBuness)
   .post('/:id', updateBusiness)
   .get('/:id', displayBusiness)

export default bunessRouter; 
