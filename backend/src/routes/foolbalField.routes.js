import express from 'express';
import { createFoolbalField, getAllFoolbalField } from '../controllers/foolbalField.controller.js';

const foolbalFieldRouter = express.Router();

foolbalFieldRouter
   .post('/', createFoolbalField)
   .get('/:id', getAllFoolbalField)
// .post('/:id', updateFoolbalField)


export default foolbalFieldRouter; 