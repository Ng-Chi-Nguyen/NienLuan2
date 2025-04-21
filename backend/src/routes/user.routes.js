import express from 'express';
import { createUser, updateUser, displayUser } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter
   .post('/', createUser)
   .post('/:id', updateUser)
   .get('/:id', displayUser)

export default userRouter; 
