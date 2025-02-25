const mongoose = require('mongoose');
require('dotenv').config();


async function connectDB() {
   try {
      await mongoose.connect(process.env.URI + process.env.DBNAME)
      console.log("Connect database success")
   } catch (e) {
      console.log(e)
   }
}
module.exports = connectDB;