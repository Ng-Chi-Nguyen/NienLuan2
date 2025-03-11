const mongoose = require("mongoose")
const ModelFoField = require("../models/FoField.model");

module.exports = {
   createFF: async (req, res) => {
      try {
         let body = req.body;
         let FF = await ModelFoField.create(body)
         if (req.headers["accept"] && req.headers["accept"].includes("application/json")) {
            return res.status(201).json({
               errCode: 0,
               message: "Tạo người dùng thành công",
               user: newUser
            });
         }

         // Nếu không phải Postman (ví dụ trình duyệt) thì chuyển hướng
         return res.redirect("/foolballField");
      } catch (e) {
         console.log(e)
      }
   },
   getAllFF: async (req, res) => {
      try {
         let FFs = await ModelFoField.find()
         return res.status(200).json({
            errCode: 0,
            message: "Tất cả người dùng",
            FoFields: FFs
         })
      } catch (e) {
         console.log(e)
      }
   },
   updateFF: async (req, res) => {
      try {
         let body = req.body;
         let id = req.params.id;
         let updateFF = await ModelFoField.findByIdAndUpdate(id, body, { new: true });
         return res.status(200).json({
            errCode: 0,
            message: "Cập nhật sân bóng thành công",
            updateFF: updateFF
         })
      } catch (e) {
         console.log(e)
      }
   },
   deleteFF: async (req, res) => {
      try {
         let id = req.params.id;
         let deleteFF = await ModelFoField.deleteOne({ _id: id });
         return res.status(200).json({
            errCode: 0,
            message: "Cập nhật sân bóng thành công",
            deleteFF: deleteFF
         })
      } catch (e) {
         console.log(e)
      }
   }
}