const mongoose = require("mongoose")

const UserSchema = mongoose.Schema({
   name: { type: String, required: true },
   email: { type: String, required: true, unique: true },
   password: { type: String, required: true },
   phone: { type: String, required: true, unique: true },
   address: { type: String, required: true },
   role: { type: Number, enum: [0, 1, 2] }
}, {
   timestamps: true, // Thoi gian tao ra tai khoan user nay
   versionKey: false // Moi lan tao se then "__v": 0 co nay se k co nua
});

module.exports = mongoose.model("Users", UserSchema)