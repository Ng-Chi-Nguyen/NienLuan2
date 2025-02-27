const mongoose = require("mongoose")

const FoFieldSchema = mongoose.Schema({
   name: { type: String, required: true, unique: true },
   address: { type: String, required: true },
   role: { type: Number, enum: [5, 7, 11] }
}, {
   timestamps: true, // Thoi gian tao ra tai khoan user nay
   versionKey: false // Moi lan tao se then "__v": 0 co nay se k co nua
});

module.exports = mongoose.model("Footballfield", FoFieldSchema)