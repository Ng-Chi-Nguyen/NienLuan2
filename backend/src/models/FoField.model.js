const mongoose = require("mongoose")

const FoFieldSchema = mongoose.Schema({
   name: { type: String, required: true },
   address: { type: String, required: true },
   role: { type: Number, enum: [5, 7, 11] }
}, {
   timestamps: true, // Thoi gian tao ra tai khoan user nay
   versionket: false // Moi lan tao se then _v co nay se k co nua
});

module.exports = mongoose.model("FoField", FoFieldSchema)