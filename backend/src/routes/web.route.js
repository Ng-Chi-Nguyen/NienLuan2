const express = require('express');
const { getHomePage, getUserPage, createUserPage, updateUserPage, getFoFieldPage } = require("../controllers/pages.controller");

const webRouter = express.Router();

webRouter
   .get("/home", getHomePage)
   .get("/user", getUserPage)
   .get("/foolballField", getFoFieldPage)
   .get("/user/createUser", createUserPage)
   .get("/user/updateUser/:id", updateUserPage)

module.exports = webRouter;
