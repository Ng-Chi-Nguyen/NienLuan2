const express = require('express');
const { getHomePage, getUserPage } = require("../controllers/pages.controller");

const webRouter = express.Router();

webRouter.get("/home", getHomePage);
webRouter.get("/user", getUserPage);

module.exports = webRouter;
