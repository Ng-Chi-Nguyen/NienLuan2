const UsersModel = require("../models/user.model")

module.exports = {
   createUser: async (req, res) => {
      try {
         let body = req.body;
         console.log(body)
         let newUser = await UsersModel.insertOne(body)
         return res.status(201).json(newUser)
      } catch (e) {
         console.log(e)
      }
   },
   getUser: async (req, res) => {
      try {
         console.log(req)
         let users = await UsersModel.find();
         // console.log(users);
         return res.status(200).json(users)
      } catch (e) {
         console.error("Lỗi khi lấy user:", e);
         return res.status(500).json({ message: "Lỗi server" });
      }
   },
   updateUser: async (req, res) => {
      let id = req.params.id;
      let body = req.body;
      let updateUser = await UsersModel.updateOne(id, body, { new: true });
      return res.status(200).json(updateUser)
   },
   deleteUser: async (req, res) => {
      let id = req.params.id;
      // console.log(id)
      let deleteUser = await UsersModel.deleteOne({ _id: id });
      return res.status(200).json(deleteUser)
   }
}
