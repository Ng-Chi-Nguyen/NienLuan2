import express from 'express';
import { createUser, updateUser } from '../controllers/user.controller.js';

const userRouter = express.Router();

userRouter
   .post('/', createUser)
   .post('/:id', updateUser)

export default userRouter; 
