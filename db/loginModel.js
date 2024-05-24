const mongoose = require("mongoose");

const loginSchema = new mongoose.Schema({
    username: { type: String },
    password: { type: String },
    user_id: mongoose.Schema.Types.ObjectId,
});
module.exports = mongoose.model.Login || mongoose.model("Login", loginSchema);
