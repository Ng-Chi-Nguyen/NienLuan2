const express = require('express');
const {
   loadPage,
   indexPage,
   updateUserPage,
} = require("../controllers/pages.controller");

const webRouter = express.Router();

webRouter
   .get("/", indexPage)
   .get("/:page", loadPage)
   .get("/updateUser/:id", updateUserPage)


module.exports = webRouter;
