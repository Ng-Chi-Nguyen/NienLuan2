const UsersModel = require("../models/user.model");
const mongoose = require("mongoose");
module.exports = {
   createUser: async (req, res) => {
      try {
         let body = req.body;
         let newUser = await UsersModel.create(body);

         return res.render("/User/User.ejs");
      } catch (error) {
         console.error("Lỗi khi tạo user:", error);
         res.status(500).json({
            errCode: 1,
            message: "Lỗi server: " + error.message
         });
      }
   },

   getUsers: async (req, res) => {
      try {
         let users = await UsersModel.find(); // Lấy tất cả user
         return res.status(201).json({
            errCode: 0,
            message: "Tất cả người dùng",
            users: users
         });
      } catch (e) {
         console.error("Lỗi khi lấy user:", e);
         return res.status(500).json({ message: "Lỗi server" });
      }
   },
   updateUser: async (req, res) => {
      try {
         let id = req.params.id;
         console.log(id)
         if (!id) {
            return res.status(400).json({
               errCode: 1,
               message: "Thiếu ID người dùng"
            });
         }
         let body = req.body;
         let updateUser = await UsersModel.findByIdAndUpdate(id, body, { new: true });

         if (req.headers["accept"] && req.headers["accept"].includes("application/json")) {
            return res.status(201).json({
               errCode: 0,
               message: "Cập nhất người dùng thành công",
               user: updateUser
            });
         }
         return res.redirect("/#user");
      } catch (e) {
         console.log(e)
      }
   },
   deleteUser: async (req, res) => {
      let id = req.params.id;
      if (!id) {
         return res.status(400).json({
            errCode: 1,
            message: "Thiếu ID người dùng"
         });
      }
      let deleteUser = await UsersModel.deleteOne({ _id: id });
      return res.status(200).json({
         errCode: 0,
         message: "Xóa người dùng thành công",
         user: deleteUser
      })
   },
   getUserById: async (req, res) => {
      try {
         let id = req.params.id;
         console.log(id)
         // Kiểm tra nếu request từ Postman (ứng dụng gửi JSON)
         if (req.headers["accept"] && req.headers["accept"].includes("application/json")) {
            return res.status(201).json({
               errCode: 0,
               message: "Lấy thông tin người dùng thành công",
               user: user
            });
         }
         let user = await UsersModel.findById(new mongoose.Types.ObjectId(id));
         if (!user) {
            return res.status(404).json({
               errCode: 1,
               message: "Không tìm thấy người dùng"
            });
         }
         // Nếu không phải Postman (ví dụ trình duyệt) thì chuyển hướng
         return res.redirect("/user");
      } catch (e) {
         console.error("Lỗi khi lấy user:", e);
         return res.status(500).json({ message: "Lỗi server" });
      }
   }

}
