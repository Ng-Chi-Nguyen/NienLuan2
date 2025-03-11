const FoFieldModel = require("../models/FoField.model");
const UsersModel = require("../models/user.model");

const indexPage = (req, res) => {
   res.render("index.ejs");
};

const loadPage = async (req, res) => {
   try {
      const page = req.params.page.toLowerCase(); // Chuyển về chữ thường để tránh lỗi
      const pageMap = {
         "user": "User/User",
         "fofield": "FF/FoField",
         "home": "Home/Home"
      };
      let data = {}
      let filePath = pageMap[page] || page; // Nếu có trong danh sách thì lấy, không thì giữ nguyên

      // Xử lý dữ liệu riêng cho từng trang
      if (page === "user") {
         data.dataTable = await UsersModel.find(); // Lấy danh sách user
         // console.log("userTable", data.dataTable)
      } else if (page === "fofield") {
         data.dataTable = await FoFieldModel.find(); // Lấy danh sách FoField
      }

      res.render(filePath, data); // Truyền dữ liệu vào view
   } catch (error) {
      console.error("Lỗi khi tải trang:", error);
      res.status(500).send("Lỗi khi tải trang");
   }
};
const updateUserPage = async (req, res) => {
   try {
      const userId = req.params.id;
      let user = await UsersModel.findById(userId);
      return res.render("User/updateUser.ejs", { User: user });
   } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
      res.status(500).send("Lỗi khi lấy thông tin người dùng");
   }
}


module.exports = {
   loadPage,
   indexPage,
   updateUserPage
};
