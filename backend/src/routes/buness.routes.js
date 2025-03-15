import express from 'express';
import { createBuness } from '../controllers/buness.controller.js';

const bunessRouter = express.Router();

bunessRouter
   .post('/', createBuness);

export default bunessRouter; 
