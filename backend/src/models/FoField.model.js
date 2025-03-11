const mongoose = require("mongoose")

const FoFieldSchema = mongoose.Schema({
   name: { type: String, required: true, unique: true },
   address: { type: String, required: true },
   price: { type: Number, required: true },
   size: { type: Number, enum: [5, 7, 11], required: true },
   status: { type: Boolean, default: true },
   image: { type: String },
   booking: [{
      user: { type: mongoose.Schema.Types.ObjectId, ref: "user" },
      date: { type: String, required: true },
      time: { type: String, required: true }
   }]
}, {
   timestamps: true, // Thoi gian tao ra tai khoan user nay
   versionKey: false // Moi lan tao se then "__v": 0 co nay se k co nua
});

module.exports = mongoose.model("Footballfield", FoFieldSchema)