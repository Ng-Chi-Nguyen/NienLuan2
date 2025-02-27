const express = require('express');

const usersRouter = express.Router();

const { createUser, getUsers, updateUser, deleteUser, getUserById } = require('../controllers/users.controller');

usersRouter
   .post("/create-user", createUser)
   .get("/get-users", getUsers)
   .get("/get-user/:id", getUserById)
   .post("/edit-user/:id", updateUser)
   .delete("/delete-user/:id", deleteUser)


module.exports = usersRouter