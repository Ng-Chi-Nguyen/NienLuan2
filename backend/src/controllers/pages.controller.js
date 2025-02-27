const UsersModel = require("../models/user.model");
const { use } = require("../routes/web.route");

const getHomePage = (req, res) => {
   return res.render("Pages/Home/Home.ejs")
}

const getUserPage = async (req, res) => {
   try {
      let users = await UsersModel.find();
      // console.log(users)
      res.render("Pages/User/User", { dataTable: users }); // Không có dấu `/` trước "Pages/User/User"
   } catch (error) {
      console.error("Lỗi khi lấy user:", error);
      res.status(500).send("Lỗi khi lấy user");
   }
};


const createUserPage = (req, res) => {
   return res.render("Pages/User/createUser.ejs")
}

const updateUserPage = async (req, res) => {
   try {
      const userId = req.params.id; // Lấy ID từ URL
      // console.log('User ID:', userId);

      // Tìm người dùng trong cơ sở dữ liệu
      let user = await UsersModel.findById(userId);
      // console.log("User: ", user)
      // Truyền thông tin người dùng vào view
      return res.render("Pages/User/updateUser.ejs", { User: user });
   } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      res.status(500).send("Lỗi khi lấy thông tin người dùng");
   }
}

const getFoFieldPage = (req, res) => {
   return res.render("Pages/FoolballField/FoField.ejs")
}

module.exports = {
   getHomePage,
   getUserPage,
   createUserPage,
   updateUserPage,
   getFoFieldPage
}