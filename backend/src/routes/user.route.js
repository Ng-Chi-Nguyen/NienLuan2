const express = require('express');

const usersRouter = express.Router();

const {
   createUser,
   getUser,
   updateUser,
   deleteUser
} = require('../controllers/users.controller');

usersRouter
   .route("/")
   .get(getUser)
   .post(createUser)
usersRouter
   .route("/:id")
   .patch(updateUser)
   .delete(deleteUser)

module.exports = usersRouter