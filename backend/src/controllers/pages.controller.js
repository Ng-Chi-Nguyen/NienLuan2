const getHomePage = (req, res) => {
   return res.render("Pages/Home/Home.ejs")
}

const getUserPage = (req, res) => {
   return res.render("Pages/User/User.ejs")
}

module.exports = {
   getHomePage,
   getUserPage
}