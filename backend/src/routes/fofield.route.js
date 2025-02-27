const express = require('express');

const FoFieldRouter = express.Router();

const { createFF, getAllFF, updateFF, deleteFF } = require("../controllers/fofield.controller")

FoFieldRouter
   .post("/create-FF", createFF)
   .get("/get-FFs", getAllFF)
   .post("/edit-FF/:id", updateFF)
   .delete("/delete-FF/:id", deleteFF)

module.exports = FoFieldRouter